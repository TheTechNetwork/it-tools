import { expect, test } from '@playwright/test';

test.describe('Tool - Lorem ipsum generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lorem-ipsum-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Lorem ipsum generator - IT Tools');
  });

  test('Generates lorem ipsum text starting with the canonical phrase', async ({ page }) => {
    // "Start with lorem ipsum" defaults to on.
    await expect(page.getByPlaceholder('Your lorem ipsum...')).toHaveValue(/^Lorem ipsum dolor sit amet/);
  });

  test('Refresh produces new lorem ipsum text', async ({ page }) => {
    await page.getByRole('button', { name: 'Refresh' }).click();
    await expect(page.getByPlaceholder('Your lorem ipsum...')).toHaveValue(/^Lorem ipsum dolor sit amet/);
  });
});
