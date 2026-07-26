import { expect, test } from '@playwright/test';

test.describe('Tool - Open graph meta generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/og-meta-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Open graph meta generator - IT Tools');
  });

  test('Generates default meta tags', async ({ page }) => {
    const output = page.getByTestId('area-content');
    await expect(output).toContainText('og:type');
    await expect(output).toContainText('website');
    await expect(output).toContainText('twitter:card');
  });

  test('Reflects the entered title in the generated meta tags', async ({ page }) => {
    await page.getByPlaceholder('Enter the title of your website...').fill('MyAwesomePage');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('og:title');
    await expect(output).toContainText('MyAwesomePage');
  });
});
