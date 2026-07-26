import { expect, test } from '@playwright/test';

test.describe('Tool - ASCII Art Text Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascii-text-drawer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('ASCII Art Text Generator - IT Tools');
  });

  test('Renders the input with its default text', async ({ page }) => {
    // The fonts are loaded from a CDN at runtime, so we do not assert on the
    // rendered ASCII output (it may not be available offline); instead we
    // verify the tool mounts and the text input is wired up.
    await expect(page.getByPlaceholder('Your text to draw')).toHaveValue('Ascii ART');
  });

  test('Updates the input value when typing', async ({ page }) => {
    const input = page.getByPlaceholder('Your text to draw');
    await input.fill('Hello');
    await expect(input).toHaveValue('Hello');
  });
});
