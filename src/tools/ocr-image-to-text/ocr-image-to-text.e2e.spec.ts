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
    await expect(page.getByText('Languages', { exact: true })).toBeVisible();
    // The button is disabled until an image is selected. c-button renders its
    // disabled state as a `.disabled` class rather than the native attribute.
    await expect(page.getByRole('button', { name: 'Extract text' })).toHaveClass(/disabled/);
  });
});
