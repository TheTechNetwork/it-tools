import { expect, test } from '@playwright/test';

test.describe('Tool - Base64 string converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/base64-string-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Base64 string encoder/decoder - IT Tools');
  });

  test('Encodes a string to base64', async ({ page }) => {
    await page.getByLabel('String to encode').fill('hello');

    await expect(page.getByLabel('Base64 of string')).toHaveValue('aGVsbG8=');
  });

  test('Decodes a base64 string back to text', async ({ page }) => {
    await page.getByLabel('Base64 string to decode').fill('aGVsbG8=');

    await expect(page.getByLabel('Decoded string')).toHaveValue('hello');
  });
});
