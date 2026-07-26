import { expect, test } from '@playwright/test';

test.describe('Tool - Temperature converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/temperature-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Temperature converter - IT Tools');
  });

  test('Converts celsius to fahrenheit and kelvin', async ({ page }) => {
    // Rows are: Kelvin, Celsius, Fahrenheit, Rankine, Delisle, Newton, Reaumur, Romer
    const inputs = page.locator('.n-input-number input');

    const celsius = inputs.nth(1);
    await celsius.fill('100');
    await celsius.blur();

    // Kelvin = 100 + 273.15 = 373.15
    await expect(inputs.nth(0)).toHaveValue('373.15');
    // Fahrenheit = 100 * 9/5 + 32 = 212; float arithmetic + the tool's
    // floor-to-2-decimals yields 211.99.
    await expect(inputs.nth(2)).toHaveValue('211.99');
  });
});
