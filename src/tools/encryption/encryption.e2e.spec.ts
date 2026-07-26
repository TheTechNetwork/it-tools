import { expect, test } from '@playwright/test';

test.describe('Tool - Encrypt / decrypt text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encryption');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Encrypt / decrypt text - IT Tools');
  });

  test('Default ciphertext is decrypted back to the clear text', async ({ page }) => {
    // The decrypt card ships with a prefilled AES ciphertext and key that
    // decrypts to "Lorem ipsum dolor sit amet".
    await expect(page.getByLabel('Your decrypted text:')).toHaveValue('Lorem ipsum dolor sit amet');
  });

  test('Encrypting produces a non-empty ciphertext different from the input', async ({ page }) => {
    const encryptedOutput = page.getByLabel('Your text encrypted:');
    const value = await encryptedOutput.inputValue();

    expect(value.length).toBeGreaterThan(0);
    expect(value).not.toEqual('Lorem ipsum dolor sit amet');
  });
});
