// Stage the figlet font definitions (.flf) shipped inside the installed figlet
// package into public/figlet/<version>/fonts/, so they can be mirrored to the
// first-party R2 bucket (see sync-figlet-assets.mjs) and, optionally, served
// same-origin from the built app / offline Docker image.
//
// The ascii-text-drawer tool fetches these fonts at runtime from a path
// versioned by the installed figlet version (see the tool's .vue), so the fonts
// can never drift from the bundled figlet engine.
//
// Run with `pnpm script:figlet:fonts`. Idempotent: re-running overwrites the
// staged copy for the current version.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(fileURLToPath(import.meta.url), '../..');

// figlet's package.json is not exposed via its `exports` map, so resolve the
// package root from its entrypoint and read the version + fonts dir from there.
function figletPackageDir() {
  let dir = path.dirname(require.resolve('figlet'));
  for (let depth = 0; depth < 6; depth++) {
    try {
      const pkg = require(path.join(dir, 'package.json'));
      if (pkg.name === 'figlet') {
        return { dir, version: pkg.version };
      }
    }
    catch {
      // keep walking up until figlet's package.json is found
    }
    dir = path.dirname(dir);
  }
  throw new Error('Could not locate the installed figlet package');
}

async function main() {
  const { dir: pkgDir, version } = figletPackageDir();
  const fontsSrc = path.join(pkgDir, 'fonts');
  const destDir = path.join(root, 'public', 'figlet', version, 'fonts');

  const fonts = (await readdir(fontsSrc)).filter(name => name.endsWith('.flf'));
  if (fonts.length === 0) {
    throw new Error(`No .flf fonts found in ${fontsSrc}`);
  }

  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });
  for (const font of fonts) {
    await cp(path.join(fontsSrc, font), path.join(destDir, font));
  }

  console.log(`Prepared ${fonts.length} figlet font(s) for v${version} at public/figlet/${version}/fonts/`);
}

main().catch((error) => {
  console.error('Failed to prepare figlet fonts:', error.message);
  process.exit(1);
});
