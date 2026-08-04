// Upload the figlet font definitions to the first-party R2 bucket that backs
// assets.thetech.network, under a path versioned by the installed figlet
// version: `figlet/<version>/fonts/`. The ascii-text-drawer tool fetches them
// from there at runtime (see the tool's .vue and the CSP connect-src allowance
// for assets.thetech.network).
//
// Run `pnpm script:figlet:fonts` first to populate public/figlet/<version>/;
// this script then mirrors that directory to the bucket.
//
// It shells out to the pre-installed `aws` CLI (R2 speaks the S3 API) instead of
// pulling the AWS SDK into the repo's dependency tree. Required env:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
// Optional: R2_BUCKET (default "thetechnetwork-assets"), FORCE=1 (re-upload
// files that already exist), DRY_RUN=1 (print the plan, touch nothing).
//
// `--check` prints "synced" if this version's manifest already records the same
// font count (so the workflow can skip prepare + upload entirely), else
// "not-synced". A successful sync writes that manifest.
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(fileURLToPath(import.meta.url), '../..');

// figlet's package.json is not exposed via its `exports` map, so resolve the
// package root from its entrypoint and read the version from there (must match
// prepare-figlet-fonts.mjs and the FIGLET_VERSION injected into the app).
function figletVersion() {
  let dir = path.dirname(require.resolve('figlet'));
  for (let depth = 0; depth < 6; depth++) {
    try {
      const pkg = require(path.join(dir, 'package.json'));
      if (pkg.name === 'figlet') {
        return pkg.version;
      }
    }
    catch {
      // keep walking up until figlet's package.json is found
    }
    dir = path.dirname(dir);
  }
  throw new Error('Could not resolve the installed figlet version');
}

const version = figletVersion();
const localDir = path.join(root, 'public', 'figlet', version);
const bucket = process.env.R2_BUCKET || 'thetechnetwork-assets';
const keyPrefix = `figlet/${version}`;
const manifestKey = `${keyPrefix}/manifest.json`;
const dryRun = !!process.env.DRY_RUN;
const force = !!process.env.FORCE;
const checkOnly = process.argv.includes('--check');

// Content-hashed, version-pinned path -> immutable, cache for a year.
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

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

function countLocalFonts() {
  if (!existsSync(path.join(localDir, 'fonts'))) {
    return 0;
  }
  return require('node:fs').readdirSync(path.join(localDir, 'fonts')).filter(f => f.endsWith('.flf')).length;
}

// The manifest records how many fonts were published for this version, so
// `--check` can tell whether there is anything to do without re-uploading.
function readManifest() {
  try {
    const out = execFileSync('aws', ['s3', 'cp', `s3://${bucket}/${manifestKey}`, '-', '--endpoint-url', endpoint()], {
      env: awsEnv(),
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(out.toString());
  }
  catch {
    return null;
  }
}

function writeManifest(fonts) {
  const manifest = JSON.stringify({ version, fonts });
  execFileSync('aws', [
    's3',
    'cp',
    '-',
    `s3://${bucket}/${manifestKey}`,
    '--content-type',
    'application/json',
    '--cache-control',
    'no-cache',
    '--endpoint-url',
    endpoint(),
  ], { env: awsEnv(), input: manifest });
  console.log('  wrote manifest.json');
}

// True if the published manifest already records at least as many fonts as the
// local staging dir holds for this version.
function isAlreadySynced() {
  const manifest = readManifest();
  if (!manifest || manifest.version !== version) {
    return false;
  }
  const expected = countLocalFonts();
  // When nothing is staged locally (fresh CI checkout before prepare), trust a
  // present manifest for this version as already-synced.
  return expected === 0 ? true : (manifest.fonts ?? 0) >= expected;
}

async function runCheck() {
  requireEnv();
  const synced = !force && isAlreadySynced();
  // Single-word stdout the workflow captures to decide whether to skip.
  console.log(synced ? 'synced' : 'not-synced');
}

async function runSync() {
  if (!existsSync(localDir)) {
    throw new Error(`No assets at ${localDir} - run \`pnpm script:figlet:fonts\` first.`);
  }

  const files = await walk(localDir);
  console.log(`Syncing ${files.length} file(s) from public/figlet/${version}/ to s3://${bucket}/${keyPrefix}/${dryRun ? ' (dry run)' : ''}`);

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
      console.log(`  would upload ${key} (${(size / 1048576).toFixed(3)} MB)`);
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
      'text/plain; charset=utf-8',
      '--cache-control',
      CACHE_CONTROL,
      '--only-show-errors',
    ]);
    uploaded++;
    bytes += size;
    console.log(`  uploaded ${key}`);
  }

  if (!dryRun) {
    writeManifest(countLocalFonts());
    console.log(`Done: ${uploaded} uploaded (${(bytes / 1048576).toFixed(1)} MB), ${skipped} already present.`);
  }
}

async function main() {
  if (checkOnly) {
    await runCheck();
    return;
  }
  await runSync();
}

main().catch((error) => {
  console.error('Failed to sync figlet assets:', error.message);
  process.exit(1);
});
