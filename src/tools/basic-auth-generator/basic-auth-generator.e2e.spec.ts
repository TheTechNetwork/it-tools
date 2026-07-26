import { expect, test } from '@playwright/test';

test.describe('Tool - Basic auth generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/basic-auth-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Basic auth generator - IT Tools');
  });

  test('Generates the base64 Authorization header from username and password', async ({ page }) => {
    await page.getByPlaceholder('Your username...').fill('test');
    await page.getByPlaceholder('Your password...').fill('test');

    // base64('test:test') === 'dGVzdDp0ZXN0'
    await expect(page.locator('.header')).toContainText('Authorization: Basic dGVzdDp0ZXN0');
  });
});
