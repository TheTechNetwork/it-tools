import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

// Full-catalogue visual regression: one golden per tool, scoped to the tool's
// own content area (`.tool-content`, which excludes the date-badged sidebar).
//
// Golden snapshots are browser- and platform-specific; Chromium-, Firefox- and
// WebKit-on-Linux goldens are all maintained (named `<tool>-<browser>-linux.png`).
// They must be generated on the exact browser builds Playwright pins for this
// version, so always refresh via the visual-regression-update workflow (which
// runs on CI's pinned browsers) rather than a local browser of a different build.

// Enumerate every tool and its primary route straight from its index.ts, so new
// tools are covered automatically the next time goldens are refreshed.
const TOOLS_DIR = resolve(import.meta.dirname, 'tools');
const tools = readdirSync(TOOLS_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(resolve(TOOLS_DIR, entry.name, 'index.ts')))
  .map((entry) => {
    const source = readFileSync(resolve(TOOLS_DIR, entry.name, 'index.ts'), 'utf8');
    const path = /path:\s*['"`]([^'"`]+)/.exec(source)?.[1];
    return path ? { name: entry.name, path } : undefined;
  })
  .filter((tool): tool is { name: string; path: string } => tool !== undefined)
  .sort((a, b) => a.name.localeCompare(b.name));

// Tools excluded from visual regression because their default render can't be
// made deterministic: live hardware, or content generated asynchronously over
// seconds whose height/state depends on capture timing (frozen RNG makes the
// value deterministic, but not when generation finishes).
const EXCLUDED = new Set([
  'camera-recorder', // live webcam stream
  'device-information', // real hardware / screen probing
  'rsa-key-pair-generator', // multi-second async key generation; content height varies by capture timing
  'mime-types', // ~1000-row table renders progressively; capture is intermittently unstable
  'ascii-text-drawer', // figlet font is fetched from a CDN at load; output height depends on network timing
]);

// Runs in the page before any app script: pin every source of runtime
// non-determinism (clock, RNG, crypto) so tools that show generated output on
// load — uuids, tokens, OTPs, dates, random ports … — render identically each
// run. Kept as a self-contained function because Playwright serialises it.
function freezeRuntime() {
  const FIXED = 1577836800000; // 2020-01-01T00:00:00Z
  const RealDate = Date;
  class FrozenDate extends RealDate {
    constructor(...args: [] | ConstructorParameters<typeof Date>) {
      // No args → freeze to FIXED; otherwise defer to the real Date. Split into
      // two branches so neither call spreads a union type (TS2556).
      if (args.length === 0) {
        super(FIXED);
      }
      else {
        super(...args);
      }
    }

    static now() {
      return FIXED;
    }
  }
  globalThis.Date = FrozenDate as DateConstructor;

  let seed = 123456789;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
    return seed;
  };
  Math.random = () => next() / 0x7FFFFFFF;

  if (globalThis.crypto) {
    globalThis.crypto.getRandomValues = (<T extends ArrayBufferView | null>(array: T): T => {
      if (array) {
        const bytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = next() & 0xFF;
        }
      }
      return array;
    }) as Crypto['getRandomValues'];
    globalThis.crypto.randomUUID = (() => '00000000-0000-4000-8000-000000000000') as Crypto['randomUUID'];
  }
}

test.describe('Visual regression', () => {
  for (const tool of tools) {
    test(tool.name, async ({ page }) => {
      test.skip(EXCLUDED.has(tool.name), 'excluded from visual regression (see EXCLUDED)');

      await page.addInitScript(freezeRuntime);
      await page.goto(tool.path);
      // Ensure web fonts are loaded and let any debounced/async output settle so
      // the rendered content is stable before snapshotting.
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.waitForTimeout(1000);

      await expect(page.locator('.tool-content')).toHaveScreenshot(`${tool.name}.png`, {
        // Generous timeout for tools with very tall content (full emoji grid,
        // complete mime-type table).
        timeout: 30_000,
        // Absorb sub-pixel anti-aliasing / rendering jitter across runs while
        // still catching real layout and content changes.
        maxDiffPixelRatio: 0.05,
      });
    });
  }
});
