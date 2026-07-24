import { expect, test } from '@playwright/test';

test.describe('Tool - Unicode inspector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unicode-inspector');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Unicode inspector - IT Tools');
  });

  test('Inspects the characters of a string', async ({ page }) => {
    await page.getByLabel('Text to inspect').fill('A€');

    await expect(page.getByText('U+0041')).toBeVisible();
    await expect(page.getByText('U+20AC')).toBeVisible();
    // € is three UTF-8 bytes.
    await expect(page.getByText('0xE2 0x82 0xAC')).toBeVisible();
  });
});
