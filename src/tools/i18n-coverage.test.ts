import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

// This test guards the internationalisation of the tool catalogue with an
// auto-ratcheting floor, mirroring the unit-coverage threshold in
// vite.config.ts. A tool counts as "internationalised" when its title and
// description are translatable: a non-empty `tools.<name>.title` and
// `.description` in locales/en.yml AND a matching `translate('tools.<name>.*')`
// call in the tool's index.ts. When coverage rises above the floor, a local
// run rewrites the floor upward so the gain is locked in; CI only ever asserts
// against the committed floor (it never writes), so the check stays
// deterministic there.

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

function usesTranslate(key: string): boolean {
  const index = readFileSync(resolve(TOOLS_DIR, key, 'index.ts'), 'utf8');
  return index.includes(`translate('tools.${key}.title')`);
}

describe('tool i18n coverage', () => {
  const toolKeys = listToolKeys();
  const enLocale = parse(readFileSync(EN_LOCALE, 'utf8')) ?? {};
  const toolsSection = enLocale.tools ?? {};

  const uncovered = toolKeys.filter(key => !(hasLocaleStrings(toolsSection, key) && usesTranslate(key)));
  const covered = toolKeys.length - uncovered.length;
  // Floor to two decimals so the measured value never overstates coverage.
  const coverage = Math.floor((covered / toolKeys.length) * 10000) / 100;

  const floorConfig = JSON.parse(readFileSync(FLOOR_FILE, 'utf8'));
  const floor: number = floorConfig.minCoveragePercent;

  it(`keeps tool i18n coverage at or above the ${floor}% floor`, () => {
    const message = uncovered.length > 0
      ? `${covered}/${toolKeys.length} tools internationalised (${coverage}%). `
      + `Missing a translate()-wired title/description in locales/en.yml:\n  - ${uncovered.join('\n  - ')}`
      : undefined;

    expect(coverage, message).toBeGreaterThanOrEqual(floor);

    // Ratchet the floor upward on local runs; CI only asserts (never writes).
    if (!process.env.CI && coverage > floor) {
      writeFileSync(FLOOR_FILE, `${JSON.stringify({ ...floorConfig, minCoveragePercent: coverage }, null, 2)}\n`);
    }
  });
});
