import { expect, test } from '@playwright/test';

test.describe('Tool - IPv4 address converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv4-address-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('IPv4 address converter - IT Tools');
  });

  test('Converts an IPv4 address to its representations', async ({ page }) => {
    await page.getByLabel('The ipv4 address:').fill('192.168.1.1');

    // exact avoids "Decimal:" matching "Hexadecimal:" and "Ipv6:" matching "Ipv6 (short):".
    await expect(page.getByLabel('Decimal:', { exact: true })).toHaveValue('3232235777');
    await expect(page.getByLabel('Hexadecimal:', { exact: true })).toHaveValue('C0A80101');
    await expect(page.getByLabel('Ipv6:', { exact: true })).toHaveValue('0000:0000:0000:0000:0000:ffff:c0a8:0101');
  });
});
