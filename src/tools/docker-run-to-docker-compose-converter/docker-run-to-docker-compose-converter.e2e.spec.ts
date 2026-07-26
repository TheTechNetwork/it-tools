import { expect, test } from '@playwright/test';

test.describe('Tool - Docker run to Docker compose converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docker-run-to-docker-compose-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Docker run to Docker compose converter - IT Tools');
  });

  test('Converts a docker run command to a docker-compose file', async ({ page }) => {
    await page.getByPlaceholder('Your docker run command to convert...').fill('docker run -p 80:80 nginx');

    const output = page.getByTestId('area-content');
    await expect(output).toContainText('services:');
    await expect(output).toContainText('image: nginx');
    await expect(output).toContainText('80:80');
  });
});
