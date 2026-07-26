import { expect, test } from '@playwright/test';

test.describe('Tool - MAC address lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mac-address-lookup');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('MAC address lookup - IT Tools');
  });

  test('Resolves the vendor for the default mac address', async ({ page }) => {
    // Default mac 20:37:06:12:34:56 -> OUI 203706 -> Cisco Systems, Inc
    await expect(page.getByText('Cisco Systems, Inc')).toBeVisible();
  });

  test('Resolves a different vendor when the mac address changes', async ({ page }) => {
    await page.getByRole('textbox').fill('E0:CB:4E:12:34:56');
    // E0CB4E -> ASUSTek COMPUTER INC.
    await expect(page.getByText('ASUSTek', { exact: false })).toBeVisible();
  });
});
