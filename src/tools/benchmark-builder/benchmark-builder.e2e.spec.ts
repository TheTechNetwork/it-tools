import { expect, test } from '@playwright/test';

test.describe('Tool - Benchmark builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/benchmark-builder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Benchmark builder - IT Tools');
  });

  test('Computes and ranks the default suites', async ({ page }) => {
    // Default suites: "Suite 1" [5, 10] (mean 7.5), "Suite 2" [8, 12] (mean 10).
    // Sorted ascending by mean, Suite 1 ranks first.
    const table = page.locator('table');

    await expect(table).toContainText('Suite 1');
    await expect(table).toContainText('Suite 2');
    await expect(table).toContainText('7.5');
    await expect(table).toContainText('10');
  });

  test('Renders the copy actions', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Copy as markdown table' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy as bullet list' })).toBeVisible();
  });
});
