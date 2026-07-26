import { expect, test } from '@playwright/test';

test.describe('Tool - Integer base converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/base-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Integer base converter - IT Tools');
  });

  test('Converts the default value 42 into every base', async ({ page }) => {
    await expect(page.getByLabel('Binary (2)')).toHaveValue('101010');
    await expect(page.getByLabel('Octal (8)')).toHaveValue('52');
    await expect(page.getByLabel('Decimal (10)')).toHaveValue('42');
    await expect(page.getByLabel('Hexadecimal (16)')).toHaveValue('2a');
  });

  test('Converts a new decimal input', async ({ page }) => {
    await page.getByLabel('Input number').fill('255');

    await expect(page.getByLabel('Binary (2)')).toHaveValue('11111111');
    await expect(page.getByLabel('Hexadecimal (16)')).toHaveValue('ff');
  });
});
