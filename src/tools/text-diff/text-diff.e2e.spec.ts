import { expect, test } from '@playwright/test';

test.describe('Tool - Text diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text diff - IT Tools');
  });

  test('Mounts the Monaco diff editor', async ({ page }) => {
    // Robust smoke test for the Monaco-based diff editor: assert it mounts in
    // the production bundle without deep editor interaction.
    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
  });

  test('Computes and renders the diff (editor worker is wired up)', async ({ page }) => {
    // The editor loads two different default models ('original text' vs
    // 'modified text') and Monaco computes the diff in a web worker. If no
    // worker is configured, the panes still mount but no diff is ever computed,
    // so no change decorations render. Asserting a char-level diff decoration
    // therefore proves the worker actually ran end to end — this fails if the
    // MonacoEnvironment worker wiring regresses.
    await expect(page.locator('.monaco-diff-editor').first()).toBeVisible();
    await expect(
      page.locator('.monaco-diff-editor .char-insert, .monaco-diff-editor .char-delete').first(),
    ).toBeAttached({ timeout: 15_000 });
  });
});
