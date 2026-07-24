import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown TOC generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-toc-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown TOC generator - IT Tools');
  });

  test('Generates a nested table of contents', async ({ page }) => {
    await page.getByLabel('Your Markdown').fill('# Title\n## Section A\n### Detail');

    await expect(page.getByLabel('Table of contents')).toHaveValue(
      '- [Title](#title)\n  - [Section A](#section-a)\n    - [Detail](#detail)',
    );
  });
});
