import { expect, test } from '@playwright/test';

test.describe('Tool - YAML prettify and format', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-prettify');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('YAML prettify and format - IT Tools');
  });

  test('Prettifies the provided YAML', async ({ page }) => {
    await page.getByPlaceholder('Paste your raw YAML here...').fill('foo:    bar');

    await expect(page.getByTestId('area-content')).toContainText('foo: bar');
  });
});
