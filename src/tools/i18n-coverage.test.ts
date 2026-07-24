import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

// This test guards the internationalisation of the tool catalogue with an
// auto-ratcheting floor, mirroring the unit-coverage threshold in
// vite.config.ts. A tool counts as "internationalised" when its index.ts calls
// translate('tools.<key>.title') and that <key> resolves to a non-empty title
// and description in locales/en.yml. The key is read from the translate() call
// rather than assumed from the folder name, because several tools keep a legacy
// key that differs from their directory (e.g. json-viewer -> tools.json-prettify).
// When coverage rises above the floor, a local run rewrites the floor upward so
// the gain is locked in; CI only ever asserts against the committed floor (it
// never writes), so the check stays deterministic there.

const ROOT = resolve(import.meta.dirname, '../..');
const TOOLS_DIR = resolve(ROOT, 'src/tools');
const EN_LOCALE = resolve(ROOT, 'locales/en.yml');
const FLOOR_FILE = resolve(ROOT, 'i18n-coverage.json');

function listToolKeys(): string[] {
  return readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(resolve(TOOLS_DIR, entry.name, 'index.ts')))
    .map(entry => entry.name)
    .sort();
}

function hasLocaleStrings(toolsSection: Record<string, any>, key: string): boolean {
  const block = toolsSection?.[key];
  return Boolean(
    block
    && typeof block.title === 'string' && block.title.trim() !== ''
    && typeof block.description === 'string' && block.description.trim() !== '',
  );
}

// The i18n key a tool uses is whatever it passes to translate() in its
// index.ts, which is NOT always the folder name — several tools keep a legacy
// key (e.g. json-viewer -> tools.json-prettify). Resolve the actual key so
// those tools are measured against the strings they really use.
function localeKeyOf(toolDir: string): string | undefined {
  const index = readFileSync(resolve(TOOLS_DIR, toolDir, 'index.ts'), 'utf8');
  return /translate\('tools\.([\w-]+)\.title'\)/.exec(index)?.[1];
}

describe('tool i18n coverage', () => {
  const toolDirs = listToolKeys();
  const enLocale = parse(readFileSync(EN_LOCALE, 'utf8')) ?? {};
  const toolsSection = enLocale.tools ?? {};

  const uncovered = toolDirs.filter((dir) => {
    const key = localeKeyOf(dir);
    return !(key !== undefined && hasLocaleStrings(toolsSection, key));
  });
  const covered = toolDirs.length - uncovered.length;
  // Floor to two decimals so the measured value never overstates coverage.
  const coverage = Math.floor((covered / toolDirs.length) * 10000) / 100;

  const floorConfig = JSON.parse(readFileSync(FLOOR_FILE, 'utf8'));
  const floor: number = floorConfig.minCoveragePercent;

  it(`keeps tool i18n coverage at or above the ${floor}% floor`, () => {
    const message = uncovered.length > 0
      ? `${covered}/${toolDirs.length} tools internationalised (${coverage}%). `
      + `Missing a translate()-wired title/description in locales/en.yml:\n  - ${uncovered.join('\n  - ')}`
      : undefined;

    expect(coverage, message).toBeGreaterThanOrEqual(floor);

    // Ratchet the floor upward on local runs; CI only asserts (never writes).
    if (!process.env.CI && coverage > floor) {
      writeFileSync(FLOOR_FILE, `${JSON.stringify({ ...floorConfig, minCoveragePercent: coverage }, null, 2)}\n`);
    }
  });
});
