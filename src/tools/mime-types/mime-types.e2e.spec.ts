import { expect, test } from '@playwright/test';

test.describe('Tool - MIME types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mime-types');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('MIME types - IT Tools');
  });

  test('Reference table lists known mime types and extensions', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toContainText('application/json');
    await expect(table).toContainText('application/pdf');
    await expect(table).toContainText('.pdf');
  });

  test('Both lookup sections render', async ({ page }) => {
    await expect(page.getByText('Mime type to extension', { exact: true })).toBeVisible();
    await expect(page.getByText('File extension to mime type', { exact: true })).toBeVisible();
  });
});
