import { expect, test } from '@playwright/test';

test.describe('Tool - Math evaluator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/math-evaluator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Math evaluator - IT Tools');
  });

  test('Evaluates a basic arithmetic expression', async ({ page }) => {
    await page.locator('textarea').first().fill('2 ^ 10 + 24');

    // The result renders inside the "Result" card.
    await expect(page.locator('.c-card').filter({ hasText: 'Result' })).toContainText('1048');
  });

  test('Evaluates a function expression', async ({ page }) => {
    await page.locator('textarea').first().fill('sqrt(144)');

    await expect(page.locator('.c-card').filter({ hasText: 'Result' })).toContainText('12');
  });
});
