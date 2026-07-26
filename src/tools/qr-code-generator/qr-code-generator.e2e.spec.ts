import { expect, test } from '@playwright/test';

test.describe('Tool - QR Code generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qrcode-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('QR Code generator - IT Tools');
  });

  test('Renders a QR code image for the given text', async ({ page }) => {
    // Smoke test: asserting the generated data-URL image proves the async
    // qrcode pipeline mounts and produces output in the production bundle.
    // Target the n-image's real <img> (getByRole('img') also matches decorative SVGs).
    const image = page.locator('.n-image img');
    await expect(image).toHaveAttribute('src', /^data:image\/png/);
  });
});
