import { expect, test } from '@playwright/test';

test.describe('Tool - Device information', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/device-information');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Device information - IT Tools');
  });

  test('Renders the screen and device information sections', async ({ page }) => {
    await expect(page.getByText('Screen size', { exact: true })).toBeVisible();
    await expect(page.getByText('Color depth', { exact: true })).toBeVisible();
    await expect(page.getByText('User agent', { exact: true })).toBeVisible();
    await expect(page.getByText('Platform', { exact: true })).toBeVisible();
  });
});
