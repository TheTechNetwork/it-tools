import { expect, test } from '@playwright/test';

test.describe('Tool - Camera recorder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camera-recorder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Camera recorder - IT Tools');
  });

  test('Mounts without crashing in the production bundle', async ({ page }) => {
    // Camera access is unavailable/blocked in headless CI, so this is a smoke
    // test: assert the tool renders one of its stable top-level states (either
    // the "not supported" / "need permission" card, or the live controls).
    await expect(page.locator('.tool-layout, main, #app').first()).toBeVisible();
    await expect(page.getByText(/camera|permission|webcam/i).first()).toBeVisible();
  });
});
