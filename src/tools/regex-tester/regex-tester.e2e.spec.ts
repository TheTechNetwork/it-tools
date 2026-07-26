import { expect, test } from '@playwright/test';

test.describe('Tool - Regex Tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/regex-tester');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Regex Tester - IT Tools');
  });

  test('Lists matches for a regex against the input text', async ({ page }) => {
    await page.getByPlaceholder('Put the regex to test').fill('\\d+');
    await page.getByPlaceholder('Put the text to match').fill('abc123def456');

    await expect(page.getByRole('cell', { name: '123', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: '456', exact: true })).toBeVisible();
  });

  test('Shows a no-match message when nothing matches', async ({ page }) => {
    await page.getByPlaceholder('Put the regex to test').fill('zzz');
    await page.getByPlaceholder('Put the text to match').fill('abcdef');

    await expect(page.getByText('No match')).toBeVisible();
  });
});
