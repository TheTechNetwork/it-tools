import { expect, test } from '@playwright/test';

test.describe('Tool - ETA calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/eta-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('ETA calculator - IT Tools');
  });

  test('Computes the total duration from the default inputs', async ({ page }) => {
    // Defaults: 186 units, 3 units per 5 minutes => 18,600,000 ms => 5h 10m.
    // The total-duration statistic depends only on these inputs (not on the
    // volatile "started at" time), so it is deterministic.
    await expect(page.getByText('5 hours 10 minutes')).toBeVisible();
  });
});
