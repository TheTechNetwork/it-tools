![Status](https://status.thetech.network/api/badge/20/status)  ![Uptime](https://status.thetech.network/api/badge/20/uptime) ![PingResponse](https://status.thetech.network/api/badge/20/ping) ![avg-response](https://status.thetech.network/api/badge/20/avg-response) ![cert-exp](https://status.thetech.network/api/badge/20/cert-exp) ![response](https://status.thetech.network/api/badge/20/response)

<picture>
    <source srcset="./.github/logo-dark.png" media="(prefers-color-scheme: light)">
    <source srcset="./.github/logo-white.png" media="(prefers-color-scheme: dark)">
    <img src="./.github/logo-dark.png" alt="logo">
</picture>

<p align="center">
Useful tools for developer and people working in IT. <a href="https://it-tools.tech">Try it!</a>
</p>

## Functionalities and roadmap

Please check the [issues](https://github.com/CorentinTh/it-tools/issues) to see if some feature listed to be implemented.

You have an idea of a tool? Submit a [feature request](https://github.com/CorentinTh/it-tools/issues/new/choose)!

## Self host

Self host solutions for your homelab. Images are published from this fork
(`thetechnetwork/it-tools`, the actively maintained source) to Docker Hub and
GitHub packages.

**From Docker Hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:8080 thetechnetwork/it-tools:latest
```

**From GitHub packages:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:8080 ghcr.io/thetechnetwork/it-tools:latest
```

### Image variants

Three image variants are published to both `thetechnetwork/it-tools` (Docker
Hub) and `ghcr.io/thetechnetwork/it-tools`, each tagged `:latest` and
`:<version>`. All three **listen on port 8080** and serve the same app
identically (gzip, security headers, immutable asset caching, SPA fallback):

| Variant | Tag suffix | Base | User |
| --- | --- | --- | --- |
| **standard** | *(none)* — `:latest` | `nginx:stable-alpine` | root |
| **rootless** | `:latest-rootless` | `nginx-unprivileged` | non-root (101) |
| **distroless** | `:latest-distroless` | `static-web-server` (scratch) | non-root |

The **rootless** and **distroless** variants pair well with a hardened runtime.
The distroless image has no shell, so use an orchestrator HTTP probe against
`/` instead of a Docker `HEALTHCHECK`. Example (rootless):

```sh
docker run -d --name it-tools -p 8080:8080 \
  --read-only --tmpfs /tmp \
  --cap-drop ALL --security-opt no-new-privileges \
  thetechnetwork/it-tools:latest-rootless
```

### Verify image signatures

Every published image (all variants, both registries) is signed with
[cosign](https://docs.sigstore.dev/) using keyless
[Sigstore](https://www.sigstore.dev/) signing — no long-lived keys, the
signer's identity is the GitHub Actions workflow that built it, recorded in the
public transparency log. Verify before pulling:

```sh
cosign verify \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp '(?i)^https://github.com/thetechnetwork/it-tools/' \
  thetechnetwork/it-tools:latest
```

Images also ship a build [SBOM](https://docs.docker.com/build/metadata/attestations/sla-sbom/)
and [SLSA provenance](https://docs.docker.com/build/metadata/attestations/slsa-provenance/)
attestation; inspect them with `docker buildx imagetools inspect thetechnetwork/it-tools:latest`.
On top of that, a CycloneDX SBOM is published as a cosign-signed attestation you
can verify (and pipe into a policy engine or vulnerability scanner):

```sh
cosign verify-attestation --type cyclonedx \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp '(?i)^https://github.com/thetechnetwork/it-tools/' \
  thetechnetwork/it-tools:latest
```

### OCR (Image to text) assets

The **Image to text (OCR)** tool runs Tesseract entirely in the browser, but the
engine (a few MB of WASM) and the per-language training data (~100 MB+ for the
full set) are too large to bundle into the app. They are served separately, from
a path **versioned by the tesseract.js version** (`tesseract/<version>/`) so the
engine can never drift from its WASM core.

**On the hosted site there is nothing to do** — the assets are served for you.
How they reach the browser depends on the platform:

- **Cloudflare** (Worker deployment, `wrangler.toml`): the Worker serves them
  **same-origin** under `/tesseract/*` from the R2 bucket bound as `OCR_ASSETS`.
- **Vercel / Netlify**: the browser fetches them from the first-party CDN
  `https://assets.thetech.network` (a public domain on the same R2 bucket). This
  is the one origin the [CSP](vercel.json) allows beyond `'self'`.

**Publishing / updating the assets** (whoever owns the bucket): the
[`ocr-assets`](.github/workflows/ocr-assets.yml) workflow prepares every language
and mirrors it to R2. It needs three repository secrets — `R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — and no-ops (staying green) until
they are set. A first-time setup is:

1. Create the R2 bucket `thetechnetwork-assets`. For the Vercel/Netlify path,
   also connect the public domain `assets.thetech.network` to it and allow the
   site origins with a CORS policy (`GET`/`HEAD`). The Cloudflare Worker path
   uses the binding instead and needs neither.
2. Add the three secrets, then run the **ocr-assets** workflow once
   (Actions → ocr-assets → Run workflow) to publish `tesseract/<version>/`.

**Self-hosting / air-gapped:** build the assets locally and serve them
same-origin — run `OCR_ALL_LANGS=1 pnpm script:ocr:assets` to populate
`public/tesseract/<version>/`, and set `VITE_OCR_ASSETS_BASE_URL=''` so the app
loads them from your own origin instead of the CDN.

<details>
<summary>Upstream images (<code>CorentinTh/it-tools</code>)</summary>

The original upstream project is no longer actively maintained. Its images
listened on port 80 and are kept here for reference:

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

</details>

**Other solutions:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

with the following settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Create a new tool

To create a new tool, there is a script that generate the boilerplate of the new tool, simply run:

```sh
pnpm run script:create:tool my-tool-name
```

It will create a directory in `src/tools` with the correct files, and a the import in `src/tools/index.ts`. You will just need to add the imported tool in the proper category and develop the tool.

## Contributors

Big thanks to all the people who have already contributed!

[![contributors](https://contrib.rocks/image?repo=corentinth/it-tools&refresh=1)](https://github.com/corentinth/it-tools/graphs/contributors)

## Credits

Coded with ❤️ by [Corentin Thomasset](https://corentin.tech?utm_source=it-tools&utm_medium=readme).

This project is continuously deployed using [vercel.com](https://vercel.com).

Contributor graph is generated using [contrib.rocks](https://contrib.rocks/preview?repo=corentinth/it-tools).

<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=345793&theme=light" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=345793&theme=light&period=daily" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## License

This project is under the [GNU GPLv3](LICENSE).
