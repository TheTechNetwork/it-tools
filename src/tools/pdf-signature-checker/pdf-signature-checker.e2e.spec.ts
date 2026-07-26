import { expect, test } from '@playwright/test';

test.describe('Tool - Pdf signature checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-signature-checker');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('PDF signature checker - IT Tools');
  });

  test('Mounts with the upload drop zone', async ({ page }) => {
    // Smoke test: the tool requires a PDF upload to produce output, so we only
    // assert it loads in the production bundle and renders its file drop zone
    // and file input without crashing.
    await expect(page.getByText('Drag and drop a PDF file here, or click to select a file')).toBeVisible();
    await expect(page.locator('input[type=file]')).toBeAttached();
  });
});
