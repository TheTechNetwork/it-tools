import { expect, test } from '@playwright/test';

test.describe('Tool - JSON to TypeScript', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-typescript');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to TypeScript - IT Tools');
  });

  test('Generates TypeScript interfaces from JSON', async ({ page }) => {
    await page.getByTestId('input').fill('{"name":"John","age":30}');

    const output = await page.getByTestId('area-content').innerText();

    expect(output).toContain('export interface RootObject {');
    expect(output).toContain('name: string;');
    expect(output).toContain('age: number;');
  });
});
