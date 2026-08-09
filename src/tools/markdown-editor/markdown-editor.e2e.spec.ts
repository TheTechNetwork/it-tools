import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-editor');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown editor - IT Tools');
  });

  test('Renders typed markdown in the live preview', async ({ page }) => {
    const input = page.getByTestId('input').first();
    await input.fill('# Hello world\n\nThis is **bold**.');

    const preview = page.getByTestId('markdown-preview');
    await expect(preview.locator('h1')).toHaveText('Hello world');
    await expect(preview.locator('strong')).toHaveText('bold');
  });
});
