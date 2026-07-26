import { expect, test } from '@playwright/test';

test.describe('Tool - Git cheatsheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/git-memo');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Git cheatsheet - IT Tools');
  });

  test('Renders the cheatsheet content', async ({ page }) => {
    // Static memo: assert the rendered markdown mounts with real git content.
    await expect(page.getByText('git', { exact: false }).first()).toBeVisible();
    await expect(page.locator('pre').first()).toBeVisible();
  });
});
