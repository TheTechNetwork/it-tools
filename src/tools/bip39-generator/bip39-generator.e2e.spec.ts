import { expect, test } from '@playwright/test';

test.describe('Tool - BIP39 passphrase generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bip39-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('BIP39 passphrase generator - IT Tools');
  });

  test('Derives the reference mnemonic from a known entropy', async ({ page }) => {
    await page.getByPlaceholder('Your string...').fill('00000000000000000000000000000000');

    await expect(page.getByPlaceholder('Your mnemonic...')).toHaveValue(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    );
  });

  test('Derives the entropy back from a known mnemonic', async ({ page }) => {
    await page
      .getByPlaceholder('Your mnemonic...')
      .fill('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');

    await expect(page.getByPlaceholder('Your string...')).toHaveValue('00000000000000000000000000000000');
  });
});
