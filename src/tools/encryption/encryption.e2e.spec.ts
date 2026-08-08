import { expect, test } from '@playwright/test';

test.describe('Tool - Encrypt / decrypt text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encryption');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Encrypt / decrypt text - IT Tools');
  });

  test('Default ciphertext is decrypted back to the clear text', async ({ page }) => {
    // The decrypt card ships with a prefilled AES-GCM ciphertext and key that
    // decrypts to "Lorem ipsum dolor sit amet". Decryption derives the key with
    // scrypt, so this may take a moment to appear.
    await expect(page.getByLabel('Your decrypted text:')).toHaveValue('Lorem ipsum dolor sit amet', { timeout: 15_000 });
  });

  test('Encrypting produces a non-empty ciphertext different from the input', async ({ page }) => {
    const encryptedOutput = page.getByLabel('Your text encrypted:');

    // The ciphertext appears once the scrypt key derivation completes.
    await expect(encryptedOutput).not.toHaveValue('', { timeout: 15_000 });
    await expect(encryptedOutput).not.toHaveValue('Lorem ipsum dolor sit amet');
  });
});
