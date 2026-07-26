import { expect, test } from '@playwright/test';

test.describe('Tool - URL encoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url-encoder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Encode/decode URL-formatted strings - IT Tools');
  });

  test('Encodes a string to percent-encoded format', async ({ page }) => {
    await page.getByPlaceholder('The string to encode').fill('Hello world :)');
    await expect(page.getByPlaceholder('Your string encoded').first()).toHaveValue('Hello%20world%20%3A)');
  });

  test('Decodes a percent-encoded string', async ({ page }) => {
    await page.getByPlaceholder('The string to decode').fill('Hello%20world%20%3A)');
    await expect(page.getByPlaceholder('Your string decoded').first()).toHaveValue('Hello world :)');
  });
});
