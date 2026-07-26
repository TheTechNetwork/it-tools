import { expect, test } from '@playwright/test';

test.describe('Tool - SQL prettify and format', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sql-prettify');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('SQL prettify and format - IT Tools');
  });

  test('Formats a SQL query with upper-cased keywords', async ({ page }) => {
    await page.getByRole('textbox').first().fill('select a,b from t where c=1;');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('SELECT');
    await expect(output).toContainText('FROM');
    await expect(output).toContainText('WHERE');
  });
});
