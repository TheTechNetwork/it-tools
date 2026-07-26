import { expect, test } from '@playwright/test';

test.describe('Tool - Random port generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-port-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Random port generator - IT Tools');
  });

  test('Generates a port outside the well-known range', async ({ page }) => {
    const portText = (await page.locator('.port').textContent())?.trim() ?? '';
    expect(portText).toMatch(/^\d{4,5}$/);

    const port = Number(portText);
    expect(port).toBeGreaterThanOrEqual(1024);
    expect(port).toBeLessThanOrEqual(65535);
  });

  test('Refresh yields another valid port', async ({ page }) => {
    await page.getByRole('button', { name: 'Refresh' }).click();

    const portText = (await page.locator('.port').textContent())?.trim() ?? '';
    const port = Number(portText);
    expect(port).toBeGreaterThanOrEqual(1024);
    expect(port).toBeLessThanOrEqual(65535);
  });
});
