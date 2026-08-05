/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
/// <reference types="vite-plugin-pwa/vue" />

// monaco-editor's `exports` map exposes subpaths for runtime (`./*` ->
// `./esm/vs/*.js`) but declares no `types` condition for them, so the slim
// standalone editor API entry (used by c-diff-editor to avoid bundling all
// language workers) has no types. Re-export the full package's types, which are
// a superset that includes the `editor` namespace the diff editor uses.
declare module 'monaco-editor/editor/editor.api' {
  export * from 'monaco-editor';
}

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
