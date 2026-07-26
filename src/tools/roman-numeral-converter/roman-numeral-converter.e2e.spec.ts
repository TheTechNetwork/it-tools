import { expect, test } from '@playwright/test';

test.describe('Tool - Roman numeral converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/roman-numeral-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Roman numeral converter - IT Tools');
  });

  test('Converts an arabic number to a roman numeral', async ({ page }) => {
    // First card: arabic -> roman (n-input-number)
    const arabicInput = page.locator('input').first();
    await arabicInput.fill('2024');

    await expect(page.getByText('MMXXIV', { exact: true })).toBeVisible();
  });

  test('Converts a roman numeral to an arabic number', async ({ page }) => {
    // Second card: roman -> arabic (c-input-text)
    const romanInput = page.locator('input').nth(1);
    await romanInput.fill('XIV');

    await expect(page.getByText('14', { exact: true })).toBeVisible();
  });
});
