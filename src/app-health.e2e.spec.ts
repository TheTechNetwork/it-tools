import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

// App-wide health crawler. For every tool route it asserts the page mounts in
// the production bundle with:
//   - no uncaught page errors (the class of failure that made bcrypt render a
//     blank page in production while its title-only test stayed green), and
//   - no unresolved i18n keys leaking as visible `tools.foo.bar` text.
//
// Routes are read from each tool's index.ts at load time so this stays in sync
// as tools are added or their paths change.

const TOOLS_DIR = resolve(import.meta.dirname, 'tools');

function toolRoutes(): { name: string; path: string }[] {
  return readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map((entry) => {
      const index = resolve(TOOLS_DIR, entry.name, 'index.ts');
      let source: string;
      try {
        source = readFileSync(index, 'utf8');
      }
      catch {
        return undefined;
      }
      const path = /path:\s*['"]([^'"]+)['"]/.exec(source)?.[1];
      return path ? { name: entry.name, path } : undefined;
    })
    .filter((r): r is { name: string; path: string } => r !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Uncaught errors that are pre-existing and unrelated to a tool's own health
// can be allowlisted here (with justification). Empty for now.
const IGNORED_ERROR_PATTERNS: RegExp[] = [];

const RAW_I18N_KEY = /\btools\.[a-z0-9-]+\.[\w.-]+/i;

const routes = toolRoutes();

test.describe('App health - every tool route', () => {
  for (const { name, path } of routes) {
    test(`${name} mounts without errors or leaked i18n keys`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', err => pageErrors.push(err.message));

      await page.goto(path, { waitUntil: 'networkidle' });
      // Let the lazily-loaded tool chunk mount and run its initial render.
      await expect(page.locator('.tool-layout, main').first()).toBeVisible();

      const relevantErrors = pageErrors.filter(
        message => !IGNORED_ERROR_PATTERNS.some(re => re.test(message)),
      );
      expect(relevantErrors, `Uncaught error(s) on ${path}:\n${relevantErrors.join('\n')}`).toEqual([]);

      const bodyText = await page.locator('body').innerText();
      const leaked = bodyText.match(RAW_I18N_KEY);
      expect(leaked ?? null, `Raw i18n key leaked on ${path}: ${leaked?.[0]}`).toBeNull();
    });
  }
});
