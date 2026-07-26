import { expect, test } from '@playwright/test';

test.describe('Tool - Keycode info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/keycode-info');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Keycode info - IT Tools');
  });

  test('Reports the pressed key details', async ({ page }) => {
    await page.locator('body').click();
    await page.keyboard.press('KeyA');

    // Fields render in order: Key, Keycode, Code, Location, Modifiers.
    // For 'a': key === 'a', keyCode === 65, code === 'KeyA'.
    const inputs = page.locator('.n-input-group input');
    await expect(inputs.nth(0)).toHaveValue('a');
    await expect(inputs.nth(1)).toHaveValue('65');
    await expect(inputs.nth(2)).toHaveValue('KeyA');
  });
});
