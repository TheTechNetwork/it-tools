import { expect, test } from '@playwright/test';

test.describe('Tool - Duration converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/duration-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Duration converter - IT Tools');
  });

  test('Converts and humanizes the default duration', async ({ page }) => {
    // Default is 3661 seconds -> minutes, and humanized to 1 hour, 1 minute, 1 second.
    await expect(page.getByLabel('Result')).toHaveValue('61.0166666666667');
    await expect(page.getByLabel('Human readable')).toHaveValue('1 hour, 1 minute, 1 second');
  });
});
