import { expect, test } from '@playwright/test';

test.describe('Tool - Emoji picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/emoji-picker');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Emoji picker - IT Tools');
  });

  test('Shows emoji groups by default', async ({ page }) => {
    await expect(page.getByText('Smileys & Emotion').first()).toBeVisible();
  });

  test('Filters emojis when searching', async ({ page }) => {
    await page.getByPlaceholder('Search emojis (e.g. \'smile\')...').fill('grinning');

    await expect(page.getByText('Search result')).toBeVisible();
    await expect(page.getByText(/grinning/i).first()).toBeVisible();
  });
});
