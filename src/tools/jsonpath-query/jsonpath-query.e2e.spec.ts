import { expect, test } from '@playwright/test';

test.describe('Tool - JSONPath query', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jsonpath-query');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSONPath query - IT Tools');
  });

  test('Evaluates the default query against the sample document', async ({ page }) => {
    await expect(page.getByTestId('area-content')).toContainText('Book A');
    await expect(page.getByTestId('area-content')).toContainText('Book B');
  });
});
