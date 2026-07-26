import { expect, test } from '@playwright/test';

test.describe('Tool - Hmac generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hmac-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Hmac generator - IT Tools');
  });

  test('Computes the HMAC-SHA256 of a known text and secret', async ({ page }) => {
    await page.getByPlaceholder('Plain text to compute the hash...').fill('The quick brown fox jumps over the lazy dog');
    await page.getByPlaceholder('Enter the secret key...').fill('key');

    // SHA256 / Hex are the default hash function and encoding.
    await expect(page.getByPlaceholder('The result of the HMAC...')).toHaveValue(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    );
  });
});
