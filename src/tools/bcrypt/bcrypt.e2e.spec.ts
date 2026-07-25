import { expect, test } from '@playwright/test';

test.describe('Tool - Bcrypt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bcrypt');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Bcrypt - IT Tools');
  });

  test('hashes a string into a well-formed bcrypt hash', async ({ page }) => {
    // Regression guard: bcryptjs pulls in crypto-browserify, which references
    // the Node `global`/`process` globals at chunk-eval time. Without the
    // browser polyfill the tool crashes on load in the production bundle and
    // renders nothing, so asserting on the rendered hash catches that class of
    // failure (a title-only check would not).
    const inputs = page.getByRole('textbox');
    await inputs.first().fill('hello world');

    const hash = page.locator('input[readonly]').first();
    await expect(hash).toHaveValue(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });

  test('reports a matching string and hash', async ({ page }) => {
    await page.getByRole('textbox').first().fill('hello world');

    const hash = await page.locator('input[readonly]').first().inputValue();

    // Scope to the compare card (its two textboxes: string, then hash) so the
    // readonly hash output in the first card doesn't shift the indices.
    const compareCard = page.locator('.c-card').filter({ hasText: 'Compare string with hash' });
    const compareInputs = compareCard.getByRole('textbox');
    await compareInputs.nth(0).fill('hello world');
    await compareInputs.nth(1).fill(hash);

    await expect(page.locator('.compare-result')).toHaveText('Yes');
  });
});
