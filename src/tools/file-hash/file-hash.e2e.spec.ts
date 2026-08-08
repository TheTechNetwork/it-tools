import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Tool - File hash', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-hash');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('File hash / checksum - IT Tools');
  });

  test('Computes checksums of an uploaded file and verifies a hash', async ({ page }) => {
    await page.setInputFiles('input[type="file"]', {
      name: 'hello.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });

    // The checker matching the pasted digest proves the file was hashed
    // correctly. SHA-256("hello"):
    await page
      .getByPlaceholder('Paste an expected hash')
      .fill('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    await expect(page.getByText('Matches the file\'s SHA-256 checksum')).toBeVisible({ timeout: 15_000 });

    // A wrong hash reports no match.
    await page.getByPlaceholder('Paste an expected hash').fill('deadbeef');
    await expect(page.getByText('No algorithm matches this hash')).toBeVisible();
  });
});
