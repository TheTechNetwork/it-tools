// Upload the Tesseract OCR assets (engine + every language) to the first-party
// R2 bucket that backs assets.thetech.network, under a path versioned by the
// tesseract.js version: `tesseract/<version>/`. The browser fetches them from
// there at runtime (see src/tools/ocr-image-to-text/ocr-image-to-text.service.ts
// and the CSP connect-src/script-src allowance for assets.thetech.network).
//
// Run `OCR_ALL_LANGS=1 pnpm script:ocr:assets` first to populate
// public/tesseract/<version>/ with the engine and all languages; this script
// then mirrors that directory to the bucket.
//
// It shells out to the pre-installed `aws` CLI (R2 speaks the S3 API) instead of
// pulling the AWS SDK into the repo's dependency tree. Required env:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
// Optional: R2_BUCKET (default "thetechnetwork-assets"), FORCE=1 (re-upload
// files that already exist), DRY_RUN=1 (print the plan, touch nothing).
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const version = require('tesseract.js/package.json').version;

const localDir = path.join(root, 'public', 'tesseract', version);
const bucket = process.env.R2_BUCKET || 'thetechnetwork-assets';
const keyPrefix = `tesseract/${version}`;
const dryRun = !!process.env.DRY_RUN;
const force = !!process.env.FORCE;

// Content-hashed, version-pinned path -> immutable, cache for a year.
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const CONTENT_TYPES = {
  '.js': 'text/javascript',
  '.wasm': 'application/wasm',
  '.traineddata': 'application/octet-stream',
  '.json': 'application/json',
};

function contentType(file) {
  return CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream';
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    }
    else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function requireEnv() {
  const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'].filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required env: ${missing.join(', ')}`);
  }
}

function awsEnv() {
  return {
    ...process.env,
    AWS_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: 'auto',
    // R2 rejects the newer default request/response integrity checksums the AWS
    // CLI (v2.23+) adds, so only send them when the operation actually requires.
    AWS_REQUEST_CHECKSUM_CALCULATION: 'WHEN_REQUIRED',
    AWS_RESPONSE_CHECKSUM_VALIDATION: 'WHEN_REQUIRED',
  };
}

function endpoint() {
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
}

function aws(args, { allowFail = false } = {}) {
  try {
    return execFileSync('aws', [...args, '--endpoint-url', endpoint()], {
      env: awsEnv(),
      stdio: allowFail ? ['ignore', 'ignore', 'ignore'] : 'inherit',
    });
  }
  catch (error) {
    if (allowFail) {
      return null;
    }
    throw error;
  }
}

function objectExists(key) {
  const result = aws(['s3api', 'head-object', '--bucket', bucket, '--key', key], { allowFail: true });
  return result !== null;
}

async function main() {
  if (!existsSync(localDir)) {
    throw new Error(`No assets at ${localDir} - run \`OCR_ALL_LANGS=1 pnpm script:ocr:assets\` first.`);
  }

  const files = await walk(localDir);
  console.log(`Syncing ${files.length} file(s) from public/tesseract/${version}/ to s3://${bucket}/${keyPrefix}/${dryRun ? ' (dry run)' : ''}`);

  if (!dryRun) {
    requireEnv();
  }

  let uploaded = 0;
  let skipped = 0;
  let bytes = 0;
  for (const file of files) {
    const rel = path.relative(localDir, file).split(path.sep).join('/');
    const key = `${keyPrefix}/${rel}`;
    const size = statSync(file).size;

    if (dryRun) {
      console.log(`  would upload ${key} (${contentType(file)}, ${(size / 1048576).toFixed(2)} MB)`);
      continue;
    }

    if (!force && objectExists(key)) {
      skipped++;
      continue;
    }

    aws([
      's3',
      'cp',
      file,
      `s3://${bucket}/${key}`,
      '--content-type',
      contentType(file),
      '--cache-control',
      CACHE_CONTROL,
      '--only-show-errors',
    ]);
    uploaded++;
    bytes += size;
    console.log(`  uploaded ${key}`);
  }

  if (!dryRun) {
    console.log(`Done: ${uploaded} uploaded (${(bytes / 1048576).toFixed(1)} MB), ${skipped} already present.`);
  }
}

main().catch((error) => {
  console.error('Failed to sync OCR assets:', error.message);
  process.exit(1);
});
