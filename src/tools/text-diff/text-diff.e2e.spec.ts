import { expect, test } from '@playwright/test';

test.describe('Tool - Text diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text diff - IT Tools');
  });

  test('Mounts the Monaco diff editor', async ({ page }) => {
    // Robust smoke test for the Monaco-based diff editor: assert it mounts in
    // the production bundle without deep editor interaction.
    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
  });
});
