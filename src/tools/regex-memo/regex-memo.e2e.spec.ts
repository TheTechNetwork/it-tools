import { expect, test } from '@playwright/test';

test.describe('Tool - Regex cheatsheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/regex-memo');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Regex cheatsheet - IT Tools');
  });

  test('Renders the cheatsheet content', async ({ page }) => {
    // Static memo tool: assert it mounts and renders its markdown content.
    await expect(page.getByRole('heading', { name: 'Normal characters' })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });
});
