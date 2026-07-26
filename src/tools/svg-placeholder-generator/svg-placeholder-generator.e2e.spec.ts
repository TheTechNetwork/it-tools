import { expect, test } from '@playwright/test';

test.describe('Tool - SVG placeholder generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/svg-placeholder-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('SVG placeholder generator - IT Tools');
  });

  test('Generates an SVG placeholder from the default dimensions', async ({ page }) => {
    // The first copyable area holds the raw SVG markup.
    const svgOutput = page.getByTestId('area-content').first();
    await expect(svgOutput).toContainText('viewBox="0 0 600 350"');
    await expect(svgOutput).toContainText('600x350');
  });

  test('Uses the custom text in the generated SVG', async ({ page }) => {
    await page.getByPlaceholder('Default is 600x350').fill('Hello world');

    await expect(page.getByTestId('area-content').first()).toContainText('Hello world');
  });
});
