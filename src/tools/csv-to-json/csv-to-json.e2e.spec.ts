import { expect, test } from '@playwright/test';

test.describe('Tool - CSV to JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('CSV to JSON - IT Tools');
  });

  test('Converts CSV with a header row into JSON objects', async ({ page }) => {
    await page.getByTestId('input').fill('name,age\nAlice,30\nBob,25');

    const output = await page.getByTestId('area-content').innerText();

    expect(JSON.parse(output)).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });
});
