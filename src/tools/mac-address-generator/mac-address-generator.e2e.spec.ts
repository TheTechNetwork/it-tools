import { expect, test } from '@playwright/test';

test.describe('Tool - MAC address generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mac-address-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('MAC address generator - IT Tools');
  });

  test('Generates a MAC address with the configured prefix', async ({ page }) => {
    const output = page.getByTestId('ulids');

    // Default prefix is 64:16:7F, uppercase, colon separated.
    await expect(output).toHaveText(/^64:16:7F(:[0-9A-F]{2}){3}$/);
  });

  test('Refresh generates a new MAC address', async ({ page }) => {
    const output = page.getByTestId('ulids');

    await expect(output).toHaveText(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
    const first = await output.innerText();

    await page.getByTestId('refresh').click();

    await expect(output).not.toHaveText(first);
    await expect(output).toHaveText(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
  });
});
