import { expect, test } from '@playwright/test';

test.describe('Tool - Slugify string', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/slugify-string');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Slugify string - IT Tools');
  });

  test('Slugifies a string', async ({ page }) => {
    await page.getByLabel('Your string to slugify').fill('Hello World! Foo');

    await expect(page.getByLabel('Your slug')).toHaveValue('hello-world-foo');
  });
});
