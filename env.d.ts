/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  PACKAGE_VERSION: string;
  GIT_SHORT_SHA: string;
  PROD: boolean;
  // Injected in vite.config.ts from the installed tesseract.js version.
  TESSERACT_VERSION: string;
  // Optional override for the OCR asset host (defaults to same-origin).
  VITE_OCR_ASSETS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
