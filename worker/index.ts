// Cloudflare Worker entrypoint. Serves the it-tools SPA from the static-assets
// binding and, same-origin, the OCR assets (Tesseract engine + language data,
// and future scribe.js assets) out of the R2 bucket bound as OCR_ASSETS.
//
// Serving these same-origin - rather than from the cross-origin CDN the other
// platforms (Vercel/Netlify) use - is what lets same-origin-only engines like
// scribe.js work on the Cloudflare deployment, and keeps the OCR fetches under
// connect-src 'self'.
//
// Routing is pinned in wrangler.toml via `run_worker_first`: /tesseract/* and
// /scribe/* reach this Worker first and stream from R2; everything else is
// served from the asset store, with SPA fallback to index.html.

interface Env {
  ASSETS: Fetcher;
  OCR_ASSETS: R2Bucket;
}

// The assets sit under a version-pinned, content-stable path, so cache hard.
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const R2_PREFIXES = ['/tesseract/', '/scribe/'];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (R2_PREFIXES.some(prefix => url.pathname.startsWith(prefix))) {
      return serveFromR2(url.pathname.replace(/^\/+/, ''), request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function serveFromR2(key: string, request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }

  const object = await env.OCR_ASSETS.get(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  // Restores the content-type the sync script set on upload.
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', IMMUTABLE_CACHE);
  headers.set('x-content-type-options', 'nosniff');

  return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}
