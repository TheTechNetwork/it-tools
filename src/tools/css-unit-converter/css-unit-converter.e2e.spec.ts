import { expect, test } from '@playwright/test';

test.describe('Tool - CSS unit converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-unit-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('CSS unit converter - IT Tools');
  });

  test('Converts 16px to 1rem by default', async ({ page }) => {
    const result = page.getByLabel('Result');
    await expect(result).toHaveValue('1');
  });
});
