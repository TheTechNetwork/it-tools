import { expect, test } from '@playwright/test';

test.describe('Tool - IPv4 subnet calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv4-subnet-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('IPv4 subnet calculator - IT Tools');
  });

  test('Computes subnet information for a CIDR block', async ({ page }) => {
    await page.getByRole('textbox').first().fill('192.168.1.1/24');

    await expect(page.getByText('255.255.255.0', { exact: true })).toBeVisible();
    await expect(page.getByText('192.168.1.255', { exact: true })).toBeVisible();
    await expect(page.getByText('192.168.1.0', { exact: true })).toBeVisible();
  });
});
