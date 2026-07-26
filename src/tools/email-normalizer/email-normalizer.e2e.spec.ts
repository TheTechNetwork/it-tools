import { expect, test } from '@playwright/test';

test.describe('Tool - Email normalizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/email-normalizer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Email normalizer - IT Tools');
  });

  test('Normalizes a gmail address by stripping dots and plus suffix', async ({ page }) => {
    await page.locator('textarea').first().fill('John.Doe+tag@gmail.com');

    await expect(page.locator('textarea[readonly]')).toHaveValue('johndoe@gmail.com');
  });

  test('Normalizes multiple emails, one per line', async ({ page }) => {
    await page.locator('textarea').first().fill('John.Doe+tag@gmail.com\nUser+Tag@Outlook.COM');

    await expect(page.locator('textarea[readonly]')).toHaveValue('johndoe@gmail.com\nuser@outlook.com');
  });
});
