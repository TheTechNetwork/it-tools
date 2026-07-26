import { expect, test } from '@playwright/test';

test.describe('Tool - WiFi QR Code generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wifi-qrcode-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('WiFi QR Code generator - IT Tools');
  });

  test('Generates a QR code once an SSID is provided', async ({ page }) => {
    const qrImage = page.locator('img[alt="wifi-qrcode"]');
    await expect(qrImage).toBeHidden();

    // Default encryption is WPA, which needs both an SSID and a password before
    // the QR string (and thus the image) is generated.
    await page.getByPlaceholder('Your WiFi SSID...').fill('MyNetwork');
    await page.getByPlaceholder('Your WiFi Password...').fill('supersecret');

    await expect(qrImage).toBeVisible();
    await expect(qrImage).toHaveAttribute('src', /^data:image\/png/);
    await expect(page.getByRole('button', { name: 'Download qr-code' })).toBeVisible();
  });
});
