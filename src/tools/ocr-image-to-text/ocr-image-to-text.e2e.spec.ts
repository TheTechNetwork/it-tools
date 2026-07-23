import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Tool - Image to text (OCR)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ocr-image-to-text');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image to text (OCR) - IT Tools');
  });

  test('Shows the upload area, language picker, quality toggle and a disabled extract button', async ({ page }) => {
    await expect(page.getByText('Drag and drop images or PDFs')).toBeVisible();
    await expect(page.getByText('Languages', { exact: true })).toBeVisible();
    await expect(page.getByText('Quality', { exact: true })).toBeVisible();
    // The button is disabled until a file is added. c-button renders its
    // disabled state as a `.disabled` class rather than the native attribute.
    await expect(page.getByRole('button', { name: 'Extract text' })).toHaveClass(/disabled/);
  });

  test('Lists uploaded images and enables extraction', async ({ page }) => {
    // A 1x1 PNG is enough to exercise the upload/list/enable flow without OCR.
    const pngBase64
      = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    await page.setInputFiles('input[type=file]', {
      name: 'pixel.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngBase64, 'base64'),
    });

    await expect(page.getByText('pixel.png')).toBeVisible();
    // Button is no longer disabled once a file is present.
    await expect(page.getByRole('button', { name: 'Extract text' })).not.toHaveClass(/disabled/);
  });
});
