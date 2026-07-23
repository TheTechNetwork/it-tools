import { createWorker } from 'tesseract.js';

export { createRecognizer, getAssetsBaseUrl, recognizeText, resolveAssetsBase, SUPPORTED_LANGUAGES };
export type { OcrImage, OcrLanguage, OcrProgress, OcrQuality, Recognizer };

interface OcrLanguage {
  code: string;
  name: string;
}

// Anything tesseract.js' recognize() accepts.
type OcrImage = File | Blob | string;

interface OcrProgress {
  status: string;
  progress: number;
}

// fast = tessdata_fast (smaller/faster, the default); best = tessdata_best
// (larger, slower, higher accuracy). Selects which tessdata directory to load.
type OcrQuality = 'fast' | 'best';

// A worker created once and reused across a batch of images, then terminated.
interface Recognizer {
  recognize: (image: OcrImage) => Promise<string>;
  terminate: () => Promise<void>;
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

// tessdata_fast lives under /tessdata, tessdata_best under /tessdata-best; both
// are published to the asset host by the sync workflow.
function langDir(quality: OcrQuality): string {
  return quality === 'best' ? 'tessdata-best' : 'tessdata';
}

// Create one worker for the given languages/quality and reuse it across many
// images before terminating - much faster than re-initializing per image when
// processing a batch (or the pages of a PDF).
async function createRecognizer({
  languages,
  quality = 'fast',
  onProgress,
}: {
  languages: string[];
  quality?: OcrQuality;
  onProgress?: (info: OcrProgress) => void;
}): Promise<Recognizer> {
  const base = getAssetsBaseUrl();

  // Pass a plain array: tesseract.js posts the languages to its worker, and a
  // reactive/proxied array would fail structured clone ("could not be cloned").
  const worker = await createWorker([...languages], 1, {
    workerPath: `${base}/worker.min.js`,
    corePath: `${base}/core`,
    langPath: `${base}/${langDir(quality)}`,
    gzip: false, // the asset host serves raw .traineddata, not .gz
    logger: (message) => {
      onProgress?.({ status: message.status, progress: message.progress });
    },
  });

  return {
    recognize: async image => (await worker.recognize(image)).data.text,
    terminate: async () => {
      await worker.terminate();
    },
  };
}

// Recognize a single image (creates a worker, recognizes, terminates).
async function recognizeText({
  image,
  languages,
  quality,
  onProgress,
}: {
  image: OcrImage;
  languages: string[];
  quality?: OcrQuality;
  onProgress?: (info: OcrProgress) => void;
}): Promise<string> {
  const recognizer = await createRecognizer({ languages, quality, onProgress });

  try {
    return await recognizer.recognize(image);
  }
  finally {
    await recognizer.terminate();
  }
}
