import { expect, test } from '@playwright/test';

test.describe('Tool - URL parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('URL parser - IT Tools');
  });

  test('Parses the default url into its constituent parts', async ({ page }) => {
    // Default url: https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash
    // Inputs in DOM order: [0] url input, then protocol, username, password, hostname, port, path, params
    const inputs = page.locator('.c-input-text input');

    await expect(inputs.nth(1)).toHaveValue('https:');
    await expect(inputs.nth(2)).toHaveValue('me');
    await expect(inputs.nth(4)).toHaveValue('it-tools.tech');
    await expect(inputs.nth(5)).toHaveValue('3000');
    await expect(inputs.nth(6)).toHaveValue('/url-parser');
  });

  test('Reparses when the url changes', async ({ page }) => {
    const inputs = page.locator('.c-input-text input');
    await inputs.nth(0).fill('https://example.com:8080/foo/bar');

    await expect(inputs.nth(4)).toHaveValue('example.com');
    await expect(inputs.nth(5)).toHaveValue('8080');
    await expect(inputs.nth(6)).toHaveValue('/foo/bar');
  });
});
