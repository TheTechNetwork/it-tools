import { expect, test } from '@playwright/test';

test.describe('Tool - Text statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-statistics');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text statistics - IT Tools');
  });

  test('Computes character, word and line counts for the given text', async ({ page }) => {
    await page.getByPlaceholder('Your text...').fill('hello world');

    await expect(page.locator('.n-statistic').filter({ hasText: 'Character count' })).toContainText('11');
    await expect(page.locator('.n-statistic').filter({ hasText: 'Word count' })).toContainText('2');
    await expect(page.locator('.n-statistic').filter({ hasText: 'Line count' })).toContainText('1');
  });
});
