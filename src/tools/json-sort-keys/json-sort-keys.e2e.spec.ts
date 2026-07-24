import { expect, test } from '@playwright/test';

test.describe('Tool - JSON sort keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-sort-keys');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON sort keys - IT Tools');
  });

  test('Sorts object keys recursively', async ({ page }) => {
    await page.getByTestId('input').fill('{"b":1,"a":{"z":2,"y":3}}');

    const output = await page.getByTestId('area-content').innerText();

    expect(JSON.parse(output)).toEqual({ a: { y: 3, z: 2 }, b: 1 });
    expect(output.indexOf('"a"')).toBeLessThan(output.indexOf('"b"'));
    expect(output.indexOf('"y"')).toBeLessThan(output.indexOf('"z"'));
  });
});
