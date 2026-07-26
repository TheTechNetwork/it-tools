import { expect, test } from '@playwright/test';

test.describe('Tool - Chronometer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chronometer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Chronometer - IT Tools');
  });

  test('Starts, counts up and resets', async ({ page }) => {
    const duration = page.locator('.duration');
    await expect(duration).toHaveText('00:00.000');

    await page.getByRole('button', { name: 'Start' }).click();
    // requestAnimationFrame accumulates elapsed ms, so the display leaves zero.
    await expect(duration).not.toHaveText('00:00.000');

    // Stop first: Reset only zeroes the counter, it does not pause the RAF, so
    // a running chronometer would immediately tick past zero again.
    await page.getByRole('button', { name: 'Stop' }).click();
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(duration).toHaveText('00:00.000');
  });
});
