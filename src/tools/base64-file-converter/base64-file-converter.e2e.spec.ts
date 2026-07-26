import { expect, test } from '@playwright/test';

test.describe('Tool - Base64 file converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/base64-file-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Base64 file converter - IT Tools');
  });

  test('Both conversion cards render', async ({ page }) => {
    await expect(page.getByText('Base64 to file', { exact: true })).toBeVisible();
    await expect(page.getByText('File to base64', { exact: true })).toBeVisible();
  });

  test('Valid base64 input enables the download button', async ({ page }) => {
    // c-button reflects its disabled state via a `disabled` class (no native
    // disabled attribute), so assert on the class rather than toBeDisabled().
    const downloadButton = page.getByRole('button', { name: 'Download file' });
    await expect(downloadButton).toHaveClass(/disabled/);

    // "hello" encoded as base64
    await page.getByPlaceholder('Put your base64 file string here...').fill('aGVsbG8=');

    await expect(downloadButton).not.toHaveClass(/disabled/);
  });
});
