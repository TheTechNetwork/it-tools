import { expect, test } from '@playwright/test';

test.describe('Tool - Text to NATO alphabet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-to-nato-alphabet');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text to NATO alphabet - IT Tools');
  });

  test('Converts text to the NATO phonetic alphabet', async ({ page }) => {
    await page.getByPlaceholder('Put your text here...').fill('abc');

    await expect(page.getByText('Alpha Bravo Charlie')).toBeVisible();
  });
});
