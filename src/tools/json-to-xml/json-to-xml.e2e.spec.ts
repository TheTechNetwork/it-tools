import { expect, test } from '@playwright/test';

test.describe('Tool - JSON to XML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-xml');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to XML - IT Tools');
  });

  test('Converts a JSON object into XML', async ({ page }) => {
    await page.getByTestId('input').fill('{"greeting":{"_text":"hello world"}}');

    const output = await page.getByTestId('area-content').innerText();

    expect(output).toBe('<greeting>hello world</greeting>');
  });

  test('Converts nested elements', async ({ page }) => {
    await page.getByTestId('input').fill('{"root":{"child":{"grandchild":{"_text":"value"}}}}');

    const output = await page.getByTestId('area-content').innerText();

    expect(output).toBe('<root><child><grandchild>value</grandchild></child></root>');
  });
});
