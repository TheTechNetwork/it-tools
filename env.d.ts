/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
/// <reference types="vite-plugin-pwa/vue" />

interface ImportMetaEnv {
  PACKAGE_VERSION: string;
  GIT_SHORT_SHA: string;
  PROD: boolean;
  // Injected in vite.config.ts from the installed tesseract.js version.
  TESSERACT_VERSION: string;
  // Injected in vite.config.ts from the installed figlet version; pins the
  // ascii-text-drawer tool's font asset path to the bundled figlet engine.
  FIGLET_VERSION: string;
  // Optional override for the OCR asset host (defaults to same-origin).
  VITE_OCR_ASSETS_BASE_URL?: string;
  // Optional override for the figlet font asset host (defaults to the
  // first-party R2 host in prod, same-origin in dev).
  VITE_FIGLET_ASSETS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
