import { expect, test } from '@playwright/test';

test.describe('Tool - JSON prettify and format', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-prettify');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON prettify and format - IT Tools');
  });

  test('Prettifies the default JSON with sorted keys', async ({ page }) => {
    const output = page.getByTestId('area-content');
    // Default input is {"hello": "world", "foo": "bar"} with sort-keys enabled,
    // so "foo" is emitted before "hello".
    await expect(output).toContainText('"foo": "bar"');
    await expect(output).toContainText('"hello": "world"');
  });

  test('Prettifies and sorts a custom JSON input', async ({ page }) => {
    await page.getByPlaceholder('Paste your raw JSON here...').fill('{"b":2,"a":1}');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('"a": 1');
    await expect(output).toContainText('"b": 2');
  });
});
