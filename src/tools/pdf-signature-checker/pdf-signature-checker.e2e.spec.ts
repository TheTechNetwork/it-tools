import { expect, test } from '@playwright/test';

test.describe('Tool - Pdf signature checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-signature-checker', { waitUntil: 'networkidle' });
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('PDF signature checker - IT Tools');
  });
});
