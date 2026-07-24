import { expect, test } from '@playwright/test';

test.describe('Tool - Data storage converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-storage-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Data storage converter - IT Tools');
  });

  test('Converts 1 MB to MiB by default', async ({ page }) => {
    // 1 MB = 1e6 bytes = 0.95367... MiB
    const result = page.getByLabel('Result');
    await expect(result).toHaveValue(/^0\.95367/);
  });
});
