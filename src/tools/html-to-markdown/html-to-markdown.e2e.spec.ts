import { expect, test } from '@playwright/test';

test.describe('Tool - HTML to Markdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-to-markdown');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('HTML to Markdown - IT Tools');
  });

  test('Converts HTML into Markdown', async ({ page }) => {
    await page.getByTestId('input').fill('<h1>Title</h1><p>A <strong>bold</strong> <a href="https://example.com">link</a>.</p>');

    const output = await page.getByTestId('area-content').innerText();

    expect(output).toContain('# Title');
    expect(output).toContain('**bold**');
    expect(output).toContain('[link](https://example.com)');
  });
});
