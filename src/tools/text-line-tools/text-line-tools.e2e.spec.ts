import { expect, test } from '@playwright/test';

test.describe('Tool - Text line tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-line-tools');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text line tools - IT Tools');
  });

  test('Deduplicates and reverses the input lines', async ({ page }) => {
    await page.getByPlaceholder('Paste your lines of text here...').fill('a\nb\na\nc');

    await page.getByText('Remove duplicates').click();
    await page.getByText('Reverse order').click();

    const result = page.getByPlaceholder('The transformed lines will appear here...');
    await expect(result).toHaveValue('c\nb\na');
  });
});
