import { expect, test } from '@playwright/test';

test.describe('Tool - Escape HTML entities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-entities');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Escape HTML entities - IT Tools');
  });

  test('Escapes HTML entities', async ({ page }) => {
    const escapeInput = page.locator('textarea:not([readonly])').first();
    await escapeInput.fill('<title>Hello & "world"</title>');

    await expect(page.locator('textarea[readonly]').first()).toHaveValue(
      '&lt;title&gt;Hello &amp; &quot;world&quot;&lt;/title&gt;',
    );
  });

  test('Unescapes HTML entities', async ({ page }) => {
    const unescapeInput = page.locator('textarea:not([readonly])').nth(1);
    await unescapeInput.fill('&lt;title&gt;IT Tool&lt;/title&gt;');

    await expect(page.locator('textarea[readonly]').nth(1)).toHaveValue('<title>IT Tool</title>');
  });
});
