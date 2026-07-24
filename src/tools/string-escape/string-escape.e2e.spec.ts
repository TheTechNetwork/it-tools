import { expect, test } from '@playwright/test';

test.describe('Tool - String escape / unescape', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/string-escape');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('String escape / unescape - IT Tools');
  });

  test('Escapes a string with quotes and newlines', async ({ page }) => {
    await page.getByLabel('String to escape').fill('say "hi"\nbye');

    await expect(page.getByLabel('Result')).toHaveValue('say \\"hi\\"\\nbye');
  });

  test('Unescapes a backslash-escaped string', async ({ page }) => {
    await page.getByText('Unescape', { exact: true }).click();

    await page.getByLabel('String to unescape').fill('a\\tb\\u0041');

    await expect(page.getByLabel('Result')).toHaveValue('a\tb A');
  });
});
