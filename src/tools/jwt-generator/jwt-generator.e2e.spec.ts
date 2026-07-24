import { expect, test } from '@playwright/test';

test.describe('Tool - JWT generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jwt-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JWT generator - IT Tools');
  });

  test('Signs a HS256 token from the default payload and secret', async ({ page }) => {
    // Default alg is HS256 with a prefilled secret + payload, so a token shows.
    const output = page.getByPlaceholder('The signed JWT will appear here');
    await expect(output).not.toHaveValue('', { timeout: 5000 });
    // A JWT is three base64url segments separated by dots.
    await expect(output).toHaveValue(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });
});
