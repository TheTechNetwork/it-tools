// Shared config for the OCR asset scripts (prepare-tesseract.mjs and
// sync-ocr-assets.mjs) so the language set and quality sources stay in lockstep,
// and so the sync script can tell whether a version is already fully published.
import process from 'node:process';

// The broad set uploaded to R2 / baked into the offline Docker image.
export const ALL_LANGUAGES = [
  'eng',
  'spa',
  'fra',
  'deu',
  'ita',
  'por',
  'nld',
  'pol',
  'ron',
  'ces',
  'hun',
  'swe',
  'dan',
  'fin',
  'nor',
  'tur',
  'ell',
  'rus',
  'ukr',
  'bul',
  'srp',
  'ara',
  'heb',
  'hin',
  'tha',
  'vie',
  'ind',
  'chi_sim',
  'chi_tra',
  'jpn',
  'kor',
  'osd',
];

// The OCR tool's quality toggle picks fast (tessdata_fast) or best
// (tessdata_best). Each is served under its own subdir of tesseract/<version>/.
export const QUALITY_SOURCES = {
  fast: { dir: 'tessdata', base: 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata_fast@main' },
  best: { dir: 'tessdata-best', base: 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata_best@main' },
};

// Default to English only so `pnpm dev` is fast; OCR_ALL_LANGS=1 selects the
// full set (the sync workflow sets it).
export function getLanguages() {
  return process.env.OCR_ALL_LANGS ? ALL_LANGUAGES : ['eng'];
}

// fast always; add best with OCR_BEST=1 (the sync workflow sets it).
export function getQualities() {
  return process.env.OCR_BEST ? ['fast', 'best'] : ['fast'];
}
