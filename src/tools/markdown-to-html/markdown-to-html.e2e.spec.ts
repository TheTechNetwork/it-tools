import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown to HTML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-to-html');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown to HTML - IT Tools');
  });

  test('Converts markdown to HTML', async ({ page }) => {
    await page.getByPlaceholder('Your Markdown content...').fill('# Hello\n\nThis is **bold**.');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('<h1>Hello</h1>');
    await expect(output).toContainText('<strong>bold</strong>');
  });
});
