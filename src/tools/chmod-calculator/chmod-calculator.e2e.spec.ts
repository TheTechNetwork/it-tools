import { expect, test } from '@playwright/test';

test.describe('Tool - Chmod calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chmod-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Chmod calculator - IT Tools');
  });

  test('Defaults to no permissions', async ({ page }) => {
    const results = page.locator('.octal-result');
    await expect(results.nth(0)).toHaveText('000');
    await expect(results.nth(1)).toHaveText('---------');
    await expect(page.locator('input[readonly]').first()).toHaveValue('chmod 000 path');
  });

  test('Granting all owner permissions yields 700 / rwx------', async ({ page }) => {
    const checkboxes = page.getByRole('checkbox');
    // Grid is row-major: read/write/execute rows, owner/group/public columns.
    // Owner column = indices 0 (read), 3 (write), 6 (execute).
    await checkboxes.nth(0).check();
    await checkboxes.nth(3).check();
    await checkboxes.nth(6).check();

    const results = page.locator('.octal-result');
    await expect(results.nth(0)).toHaveText('700');
    await expect(results.nth(1)).toHaveText('rwx------');
    await expect(page.locator('input[readonly]').first()).toHaveValue('chmod 700 path');
  });
});
