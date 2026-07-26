import { expect, test } from '@playwright/test';

test.describe('Tool - XML to JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-to-json');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('XML to JSON - IT Tools');
  });

  test('Converts the default XML input into JSON', async ({ page }) => {
    // Default input is <a x="1.234" y="It's"/>
    const output = page.getByTestId('area-content');
    await expect(output).toContainText('_attributes');
    await expect(output).toContainText('1.234');
  });

  test('Converts a custom XML input', async ({ page }) => {
    await page.getByTestId('input').fill('<root><item>value</item></root>');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('root');
    await expect(output).toContainText('_text');
    await expect(output).toContainText('value');
  });
});
