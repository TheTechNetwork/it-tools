import { createWorker } from 'tesseract.js';

export { getAssetsBaseUrl, recognizeText, resolveAssetsBase, SUPPORTED_LANGUAGES };
export type { OcrLanguage };

interface OcrLanguage {
  code: string;
  name: string;
}

// OCR assets (engine + language data). In production they are fetched from the
// first-party CDN (assets.thetech.network, an R2 bucket serving every language);
// in dev and in the offline Docker image they are served same-origin from
// public/tesseract (populated by `pnpm script:ocr:assets`). An explicit
// VITE_OCR_ASSETS_BASE_URL override always wins - that origin must then be
// allowed by the CSP connect-src/script-src. The path is versioned by the
// tesseract.js version so the engine and its WASM core stay in lockstep.
function resolveAssetsBase({ prod, override }: { prod: boolean; override?: string }): string {
  const fallback = prod ? 'https://assets.thetech.network' : '';
  return (override ?? fallback).replace(/\/+$/, '');
}

const ASSETS_BASE = resolveAssetsBase({ prod: import.meta.env.PROD, override: import.meta.env.VITE_OCR_ASSETS_BASE_URL });
const ASSETS_VERSION = import.meta.env.TESSERACT_VERSION;

function getAssetsBaseUrl(): string {
  return `${ASSETS_BASE}/tesseract/${ASSETS_VERSION}`;
}

// Languages offered in the UI. Codes are Tesseract language codes and must match
// what the sync script uploads to the asset host.
const SUPPORTED_LANGUAGES: OcrLanguage[] = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'nld', name: 'Dutch' },
  { code: 'pol', name: 'Polish' },
  { code: 'ron', name: 'Romanian' },
  { code: 'ces', name: 'Czech' },
  { code: 'hun', name: 'Hungarian' },
  { code: 'swe', name: 'Swedish' },
  { code: 'dan', name: 'Danish' },
  { code: 'fin', name: 'Finnish' },
  { code: 'nor', name: 'Norwegian' },
  { code: 'tur', name: 'Turkish' },
  { code: 'ell', name: 'Greek' },
  { code: 'rus', name: 'Russian' },
  { code: 'ukr', name: 'Ukrainian' },
  { code: 'bul', name: 'Bulgarian' },
  { code: 'srp', name: 'Serbian' },
  { code: 'ara', name: 'Arabic' },
  { code: 'heb', name: 'Hebrew' },
  { code: 'hin', name: 'Hindi' },
  { code: 'tha', name: 'Thai' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'ind', name: 'Indonesian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
];

async function recognizeText({
  image,
  languages,
  onProgress,
}: {
  image: File | string;
  languages: string[];
  onProgress?: (info: { status: string; progress: number }) => void;
}): Promise<string> {
  const base = getAssetsBaseUrl();

  // Pass a plain array: tesseract.js posts the languages to its worker, and a
  // reactive/proxied array would fail structured clone ("could not be cloned").
  const worker = await createWorker([...languages], 1, {
    workerPath: `${base}/worker.min.js`,
    corePath: `${base}/core`,
    langPath: `${base}/tessdata`,
    gzip: false, // the asset host serves raw .traineddata, not .gz
    logger: (message) => {
      onProgress?.({ status: message.status, progress: message.progress });
    },
  });

  try {
    const { data } = await worker.recognize(image);
    return data.text;
  }
  finally {
    await worker.terminate();
  }
}
