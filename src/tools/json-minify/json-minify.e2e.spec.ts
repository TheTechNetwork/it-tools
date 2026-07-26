import { expect, test } from '@playwright/test';

test.describe('Tool - JSON minify', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-minify');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON minify - IT Tools');
  });

  test('Minifies a formatted JSON input', async ({ page }) => {
    await page.getByTestId('input').fill('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');

    await expect(page.getByTestId('area-content')).toContainText('{"a":1,"b":[2,3]}');
  });
});
