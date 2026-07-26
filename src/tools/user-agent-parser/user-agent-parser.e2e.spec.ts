import { expect, test } from '@playwright/test';

test.describe('Tool - User-agent parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-agent-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('User-agent parser - IT Tools');
  });

  test('Parses a known user-agent string', async ({ page }) => {
    await page
      .getByPlaceholder('Put your user-agent here...')
      .fill(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );

    await expect(page.getByText('Chrome', { exact: true })).toBeVisible();
    await expect(page.getByText('Windows', { exact: true })).toBeVisible();
  });
});
