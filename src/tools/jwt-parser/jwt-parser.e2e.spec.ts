import { expect, test } from '@playwright/test';

test.describe('Tool - JWT parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jwt-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JWT parser - IT Tools');
  });

  test('Decodes the default token payload and header', async ({ page }) => {
    // Default token payload contains sub=1234567890 and name="John Doe",
    // header alg=HS256.
    await expect(page.locator('table')).toContainText('John Doe');
    await expect(page.locator('table')).toContainText('1234567890');
    await expect(page.locator('table')).toContainText('HS256');
  });

  test('Decodes a custom token', async ({ page }) => {
    // {"alg":"HS256","typ":"JWT"} . {"role":"admin"}
    const token
      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.abc';
    await page.getByRole('textbox').first().fill(token);

    await expect(page.locator('table')).toContainText('role');
    await expect(page.locator('table')).toContainText('admin');
  });
});
