import { expect, test } from '@playwright/test';

test.describe('Tool - Image to text (OCR)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ocr-image-to-text');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image to text (OCR) - IT Tools');
  });

  test('Shows the upload area, language picker and a disabled extract button', async ({ page }) => {
    await expect(page.getByText('Drag and drop an image')).toBeVisible();
    await expect(page.getByText('Languages')).toBeVisible();
    // The button is disabled until an image is selected.
    await expect(page.getByRole('button', { name: 'Extract text' })).toBeDisabled();
  });
});
