import { expect, test } from '@playwright/test';

test.describe('Tool - Hash text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-text');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Hash text - IT Tools');
  });

  test('Hashes the input text with multiple algorithms', async ({ page }) => {
    await page.locator('textarea').fill('hello');

    await expect(page.locator('.n-input-group', { hasText: 'MD5' }).locator('input')).toHaveValue(
      '5d41402abc4b2a76b9719d911017c592',
    );
    await expect(page.locator('.n-input-group', { hasText: 'SHA1' }).locator('input')).toHaveValue(
      'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    );
    await expect(page.locator('.n-input-group', { hasText: 'SHA256' }).locator('input')).toHaveValue(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  test('Changes the digest encoding', async ({ page }) => {
    await page.locator('textarea').fill('hello');

    const md5 = page.locator('.n-input-group', { hasText: 'MD5' }).locator('input');
    await expect(md5).toHaveValue('5d41402abc4b2a76b9719d911017c592');

    // Scope to the tool card so the navbar language switcher (also a c-select)
    // isn't matched.
    const card = page.locator('.c-card');
    await card.locator('.c-select-input').click();
    await card.locator('.c-select-dropdown-option', { hasText: 'Binary (base 2)' }).click();

    await expect(md5).toHaveValue(/^[01]{128}$/);
  });
});
