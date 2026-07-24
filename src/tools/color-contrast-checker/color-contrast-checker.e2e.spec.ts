import { expect, test } from '@playwright/test';

test.describe('Tool - Color contrast checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-contrast-checker');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Color contrast checker - IT Tools');
  });

  test('Shows the contrast ratio for the default colors', async ({ page }) => {
    // Default #333333 on #ffffff has a contrast ratio of about 12.63:1.
    await expect(page.getByText(/^\d+\.\d{2}:1$/)).toBeVisible();
    await expect(page.getByText('12.63:1')).toBeVisible();
  });
});
