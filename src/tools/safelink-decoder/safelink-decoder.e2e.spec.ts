import { expect, test } from '@playwright/test';

test.describe('Tool - Outlook Safelink decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/safelink-decoder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Outlook Safelink decoder - IT Tools');
  });

  test('Decodes a SafeLinks URL back to the original URL', async ({ page }) => {
    const safeLink
      = 'https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fpath%3Fa%3D1&data=abc';
    await page.getByPlaceholder('Your input Outlook SafeLink Url...').fill(safeLink);

    await expect(page.getByTestId('area-content')).toContainText('https://example.com/path?a=1');
  });

  test('Reports an error for a non-SafeLinks URL', async ({ page }) => {
    await page.getByPlaceholder('Your input Outlook SafeLink Url...').fill('https://example.com');

    await expect(page.getByTestId('area-content')).toContainText('Invalid SafeLinks URL provided');
  });
});
