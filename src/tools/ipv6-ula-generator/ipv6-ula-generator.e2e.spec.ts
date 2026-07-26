import { expect, test } from '@playwright/test';

test.describe('Tool - IPv6 ULA generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv6-ula-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('IPv6 ULA generator - IT Tools');
  });

  test('Generates a ULA and routable blocks for the default mac address', async ({ page }) => {
    // Result inputs (in DOM order): ULA (/48), first routable block (/64), last routable block (/64)
    const inputs = page.locator('.c-input-text input');

    // input 0 is the mac address field; results follow
    await expect(inputs.nth(1)).toHaveValue(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}::\/48$/);
    await expect(inputs.nth(2)).toHaveValue(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}:0::\/64$/);
    await expect(inputs.nth(3)).toHaveValue(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}:ffff::\/64$/);
  });

  test('Hides results for an invalid mac address', async ({ page }) => {
    const macInput = page.locator('.c-input-text input').first();
    await macInput.fill('not-a-mac');

    // Only the mac input remains; no result inputs are rendered
    await expect(page.locator('.c-input-text input')).toHaveCount(1);
  });
});
