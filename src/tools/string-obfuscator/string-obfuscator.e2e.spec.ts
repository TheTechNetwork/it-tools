import { expect, test } from '@playwright/test';

test.describe('Tool - String obfuscator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/string-obfuscator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('String obfuscator - IT Tools');
  });

  test('Obfuscates the default string keeping first/last chars and spaces', async ({ page }) => {
    // Default: "Lorem ipsum dolor sit amet", keepFirst=4, keepLast=4, keepSpaces=true
    await expect(page.getByText('Lore* ***** ***** *** amet')).toBeVisible();
  });

  test('Re-obfuscates when the input changes', async ({ page }) => {
    await page.locator('textarea').fill('abcdefghij');
    // keepFirst=4, keepLast=4 -> "abcd" + "**" + "ghij"
    await expect(page.getByText('abcd**ghij')).toBeVisible();
  });
});
