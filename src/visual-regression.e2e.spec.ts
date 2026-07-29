import { expect, test } from '@playwright/test';

// Visual-regression pilot. Golden snapshots are browser- and platform-specific;
// only Chromium-on-Linux goldens are maintained for now, so skip other browsers
// (Firefox/WebKit run only on the main branch and have no goldens here).
//
// Each case screenshots the tool's own content area (`.tool-content`), which
// excludes the sidebar — the sidebar carries date-based "new" badges that would
// make full-page snapshots drift over time.
test.describe('Visual regression', () => {
  // Opt-in pilot. Golden snapshots are Chromium- and version-specific, so they
  // must be (re)generated on the same browser CI uses before this is wired into
  // the pipeline. Until then it stays off the default e2e run so it can't red CI.
  //   pnpm test:e2e:visual                     # compare against goldens
  //   pnpm test:e2e:visual --update-snapshots  # refresh goldens on this browser
  test.skip(!process.env.VISUAL, 'Set VISUAL=1 to run the visual-regression pilot');
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium goldens only (pilot)');

  async function waitForStableRender(page: import('@playwright/test').Page) {
    // Ensure web fonts are loaded so text metrics are stable before snapshotting.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
  }

  test('case-converter renders consistently', async ({ page }) => {
    await page.goto('/case-converter');

    // Fixed input keeps the rendered output fully deterministic.
    await page.getByLabel('Your string:').fill('The quick brown fox');
    await expect(page.getByLabel('Camelcase:')).toHaveValue('theQuickBrownFox');

    await waitForStableRender(page);
    await expect(page.locator('.tool-content')).toHaveScreenshot('case-converter.png');
  });

  test('roman-numeral-converter renders consistently', async ({ page }) => {
    await page.goto('/roman-numeral-converter');

    // Default state (42 <-> XLII) is deterministic.
    await expect(page.locator('.tool-content')).toContainText('XLII');

    await waitForStableRender(page);
    await expect(page.locator('.tool-content')).toHaveScreenshot('roman-numeral-converter.png');
  });
});
