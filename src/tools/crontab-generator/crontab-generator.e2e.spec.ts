import { expect, test } from '@playwright/test';

test.describe('Tool - Crontab generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crontab-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Crontab generator - IT Tools');
  });

  test('Describes a cron expression in human-readable form', async ({ page }) => {
    await page.getByPlaceholder('* * * * *').fill('* * * * *');
    await expect(page.locator('.cron-string')).toContainText('Every minute');

    await page.getByPlaceholder('* * * * *').fill('0 0 1 1 *');
    await expect(page.locator('.cron-string')).toContainText('January');
  });
});
