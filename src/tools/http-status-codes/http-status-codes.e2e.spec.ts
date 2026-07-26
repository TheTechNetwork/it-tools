import { expect, test } from '@playwright/test';

test.describe('Tool - Http status codes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-status-codes');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('HTTP status codes - IT Tools');
  });

  test('Filters the list to a matching status code', async ({ page }) => {
    // Before searching, unrelated codes are present.
    await expect(page.getByText('200 OK', { exact: true })).toBeVisible();

    await page.getByPlaceholder('Search http status...').fill('404');

    // The matching code, its name and description are shown.
    await expect(page.getByText('404 Not Found', { exact: true })).toBeVisible();
    await expect(
      page.getByText('The requested resource could not be found but may be available in the future.'),
    ).toBeVisible();

    // And unrelated codes are filtered out.
    await expect(page.getByText('200 OK', { exact: true })).toBeHidden();
  });
});
