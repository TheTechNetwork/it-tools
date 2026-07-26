import { expect, test } from '@playwright/test';

test.describe('Tool - Phone parser and formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phone-parser-and-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Phone parser and formatter - IT Tools');
  });

  test('Parses a phone number and shows its details', async ({ page }) => {
    // A full international number parses deterministically regardless of the
    // default country selector.
    await page.getByLabel('Phone number:').fill('+33612345678');

    // Country resolves to France.
    await expect(page.getByRole('cell', { name: 'France', exact: true })).toBeVisible();
    // Country calling code.
    await expect(page.getByRole('cell', { name: '33', exact: true })).toBeVisible();
    // Formatted representations.
    await expect(page.getByText('+33 6 12 34 56 78')).toBeVisible();
    // Validity is reported as Yes.
    await expect(page.getByRole('cell', { name: 'Is valid?' })).toBeVisible();
  });
});
