import { expect, test } from '@playwright/test';

test.describe('Tool - RSA key pair generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rsa-key-pair-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('RSA key pair generator - IT Tools');
  });

  test('Generates a public and private PEM key pair on load', async ({ page }) => {
    const outputs = page.getByTestId('area-content');

    // Key generation happens in the browser and can take a moment, so give the
    // assertions a generous timeout.
    await expect(outputs.first()).toContainText('BEGIN PUBLIC KEY', { timeout: 20000 });
    await expect(outputs.nth(1)).toContainText('BEGIN RSA PRIVATE KEY', { timeout: 20000 });
  });
});
