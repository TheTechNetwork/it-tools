import { expect, test } from '@playwright/test';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test.describe('Tool - UUIDs generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuid-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('UUIDs generator - IT Tools');
  });

  test('Generates a valid v4 UUID', async ({ page }) => {
    const output = page.locator('textarea[readonly]').first();

    await expect(output).toHaveValue(UUID_V4_REGEX);
  });

  test('Generates a new UUID on refresh', async ({ page }) => {
    const output = page.locator('textarea[readonly]').first();
    const initial = await output.inputValue();

    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(output).not.toHaveValue(initial);
    await expect(output).toHaveValue(UUID_V4_REGEX);
  });
});
