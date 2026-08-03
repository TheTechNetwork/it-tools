import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// Visual-regression checks. Golden snapshots are browser- and platform-specific;
// only Chromium-on-Linux goldens are maintained (the browser Playwright pins for
// this project), so other browsers are skipped. Refresh the goldens with
// `pnpm test:e2e:visual --update-snapshots` (on the CI browser, or via the
// visual-regression-update workflow).
//
// Each case screenshots the tool's own content area (`.tool-content`), which
// excludes the sidebar — the sidebar carries date-based "new" badges that would
// make full-page snapshots drift over time. Inputs are fixed (or a deterministic
// default is asserted first) so the rendered output never varies between runs.
test.describe('Visual regression', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium goldens only');

  async function waitForStableRender(page: Page) {
    // Ensure web fonts are loaded so text metrics are stable before snapshotting.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
  }

  async function snapshot(page: Page, name: string) {
    await waitForStableRender(page);
    await expect(page.locator('.tool-content')).toHaveScreenshot(name);
  }

  test('case-converter renders consistently', async ({ page }) => {
    await page.goto('/case-converter');
    await page.getByLabel('Your string:').fill('The quick brown fox');
    await expect(page.getByLabel('Camelcase:')).toHaveValue('theQuickBrownFox');
    await snapshot(page, 'case-converter.png');
  });

  test('roman-numeral-converter renders consistently', async ({ page }) => {
    await page.goto('/roman-numeral-converter');
    // Default state (42 <-> XLII) is deterministic.
    await expect(page.locator('.tool-content')).toContainText('XLII');
    await snapshot(page, 'roman-numeral-converter.png');
  });

  test('integer-base-converter renders consistently', async ({ page }) => {
    await page.goto('/base-converter');
    // Default input is 42; assert a converted value before snapshotting.
    await expect(page.getByLabel('Binary (2)')).toHaveValue('101010');
    await snapshot(page, 'integer-base-converter.png');
  });

  test('chmod-calculator renders consistently', async ({ page }) => {
    await page.goto('/chmod-calculator');
    // Default permissions render as `chmod 000 path`.
    await expect(page.locator('input[readonly]').first()).toHaveValue('chmod 000 path');
    await snapshot(page, 'chmod-calculator.png');
  });

  test('docker-run-to-docker-compose-converter renders consistently', async ({ page }) => {
    await page.goto('/docker-run-to-docker-compose-converter');
    await page.getByPlaceholder('Your docker run command to convert...').fill('docker run -p 80:80 nginx');
    await expect(page.locator('.tool-content')).toContainText('services:');
    await snapshot(page, 'docker-run-to-docker-compose-converter.png');
  });

  test('text-to-nato-alphabet renders consistently', async ({ page }) => {
    await page.goto('/text-to-nato-alphabet');
    await page.getByPlaceholder('Put your text here...').fill('abc');
    await expect(page.locator('.tool-content')).toContainText('Alpha');
    await snapshot(page, 'text-to-nato-alphabet.png');
  });
});
