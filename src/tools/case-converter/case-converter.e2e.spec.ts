import { expect, test } from '@playwright/test';

test.describe('Tool - Case converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/case-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Case converter - IT Tools');
  });

  test('Converts a string into the various cases', async ({ page }) => {
    await page.getByLabel('Your string:').fill('Hello world');

    await expect(page.getByLabel('Lowercase:')).toHaveValue('hello world');
    await expect(page.getByLabel('Uppercase:')).toHaveValue('HELLO WORLD');
    await expect(page.getByLabel('Camelcase:')).toHaveValue('helloWorld');
    await expect(page.getByLabel('Constantcase:')).toHaveValue('HELLO_WORLD');
    await expect(page.getByLabel('Kebabcase:')).toHaveValue('hello-world');
    await expect(page.getByLabel('Snakecase:')).toHaveValue('hello_world');
    await expect(page.getByLabel('Pascalcase:')).toHaveValue('HelloWorld');
  });
});
