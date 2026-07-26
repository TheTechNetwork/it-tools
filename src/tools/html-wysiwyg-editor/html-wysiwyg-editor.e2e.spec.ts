import { expect, test } from '@playwright/test';

test.describe('Tool - HTML WYSIWYG editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-wysiwyg-editor');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('HTML WYSIWYG editor - IT Tools');
  });

  test('Mounts the rich-text editor with its default content', async ({ page }) => {
    // Robust smoke test: the tiptap editor renders the default document, and
    // the HTML output pane mirrors it.
    await expect(page.getByRole('heading', { name: 'Hey!' })).toBeVisible();
    await expect(page.getByTestId('area-content')).toContainText('Welcome to this html wysiwyg editor');
  });
});
