import { expect, test } from '@playwright/test';

test.describe('Tool - Number to words', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/number-to-words');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Number to words - IT Tools');
  });

  test('Spells out the default number', async ({ page }) => {
    await expect(page.getByLabel('In words')).toHaveValue('one thousand two hundred thirty-four');
  });

  test('Handles decimals', async ({ page }) => {
    await page.getByLabel('Number').fill('3.14');

    await expect(page.getByLabel('In words')).toHaveValue('three point one four');
  });
});
