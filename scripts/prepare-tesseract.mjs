// Populate Tesseract OCR assets under public/tesseract/<version>/ so they are
// served same-origin. Two consumers:
//   - `pnpm dev` (default: English only, fast) for local OCR, and
//   - the asset-sync workflow, which runs this with OCR_ALL_LANGS=1 and then
//     uploads the result to the R2 bucket behind assets.thetech.network
//     (scripts/sync-ocr-assets.mjs).
//
// In production the browser fetches these from that CDN, so ordinary builds do
// NOT need this. For an air-gapped self-host, run it with OCR_ALL_LANGS=1 and
// point VITE_OCR_ASSETS_BASE_URL back to same-origin ('').
//
// The path is versioned by the installed tesseract.js version so the engine can
// never drift from its WASM core. public/tesseract/ is git-ignored.
import { Buffer } from 'node:buffer';
import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(fileURLToPath(import.meta.url), '../..');

const version = require('tesseract.js/package.json').version;

const outDir = path.join(root, 'public', 'tesseract', version);
const coreDir = path.join(outDir, 'core');
const tessdataDir = path.join(outDir, 'tessdata');
const tessdataBestDir = path.join(outDir, 'tessdata-best');

// The broad set baked into the offline image / uploaded to R2.
const ALL_LANGUAGES = [
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

// Default to English only so `pnpm dev` is fast; opt into the full set with
// OCR_ALL_LANGS=1 (the asset-sync workflow does this).
const languages = process.env.OCR_ALL_LANGS ? ALL_LANGUAGES : ['eng'];

// The OCR tool's quality toggle picks fast (tessdata_fast) or best
// (tessdata_best). Fetch fast always; add best with OCR_BEST=1 (the sync
// workflow sets it so both qualities are published).
const QUALITIES = [
  { name: 'tessdata_fast', base: 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata_fast@main', destDir: tessdataDir },
  ...(process.env.OCR_BEST
    ? [{ name: 'tessdata_best', base: 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata_best@main', destDir: tessdataBestDir }]
    : []),
];

async function copyEngine() {
  const tesseractPkg = require.resolve('tesseract.js/package.json');
  const worker = path.join(path.dirname(tesseractPkg), 'dist', 'worker.min.js');
  const requireFromTesseract = createRequire(tesseractPkg);
  const core = path.dirname(requireFromTesseract.resolve('tesseract.js-core/package.json'));

  if (!existsSync(worker) || !existsSync(core)) {
    throw new Error('tesseract.js engine files not found - run pnpm install first');
  }

  await mkdir(coreDir, { recursive: true });
  await cp(worker, path.join(outDir, 'worker.min.js'));

  // Only the LSTM cores are needed (OEM_LSTM_ONLY); tesseract.js picks the
  // simd / relaxed-simd / plain build at runtime from SIMD feature detection.
  for (const file of await readdir(core)) {
    if (file.includes('lstm') && (file.endsWith('.wasm') || file.endsWith('.js'))) {
      await cp(path.join(core, file), path.join(coreDir, file));
    }
  }
}

async function fetchWithRetry(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return Buffer.from(await response.arrayBuffer());
    }
    catch (error) {
      if (attempt === attempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

async function downloadLanguages({ base, destDir, name }) {
  await mkdir(destDir, { recursive: true });
  let downloaded = 0;
  for (const lang of languages) {
    const dest = path.join(destDir, `${lang}.traineddata`);
    if (existsSync(dest) && (await stat(dest)).size > 0) {
      continue;
    }
    const data = await fetchWithRetry(`${base}/${lang}.traineddata`);
    await writeFile(dest, data);
    downloaded++;
    console.log(`  fetched ${name}/${lang}.traineddata (${(data.length / 1048576).toFixed(1)} MB)`);
  }
  return downloaded;
}

async function main() {
  const qualityNames = QUALITIES.map(quality => quality.name).join(' + ');
  console.log(`Preparing Tesseract assets in public/tesseract/${version}/ (${languages.length} language(s), ${qualityNames}) ...`);
  await mkdir(outDir, { recursive: true });
  await copyEngine();
  let downloaded = 0;
  for (const quality of QUALITIES) {
    downloaded += await downloadLanguages(quality);
  }
  console.log(downloaded > 0 ? `Done (downloaded ${downloaded} file(s)).` : 'Done (assets already present).');
}

main().catch((error) => {
  console.error('Failed to prepare Tesseract assets:', error.message);
  process.exit(1);
});
