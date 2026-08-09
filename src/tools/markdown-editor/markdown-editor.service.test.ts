// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderMarkdownToHtml, renderMarkdownToSafeHtml } from './markdown-editor.service';

describe('markdown-editor', () => {
  describe('renderMarkdownToHtml', () => {
    it('converts headings and paragraphs', () => {
      expect(renderMarkdownToHtml('# Title')).toBe('<h1>Title</h1>\n');
      expect(renderMarkdownToHtml('hello world')).toBe('<p>hello world</p>\n');
    });

    it('converts emphasis, links and lists', () => {
      expect(renderMarkdownToHtml('*italic* and **bold**')).toBe('<p><em>italic</em> and <strong>bold</strong></p>\n');
      expect(renderMarkdownToHtml('- one\n- two')).toBe('<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n');
    });

    it('handles an empty string', () => {
      expect(renderMarkdownToHtml('')).toBe('');
    });
  });

  describe('renderMarkdownToSafeHtml', () => {
    it('renders regular markdown', () => {
      expect(renderMarkdownToSafeHtml('# Title')).toContain('<h1>Title</h1>');
    });

    it('strips dangerous markup authored as raw html', () => {
      const output = renderMarkdownToSafeHtml('<img src=x onerror="alert(1)">');
      expect(output).not.toContain('onerror');
    });

    it('drops script tags', () => {
      const output = renderMarkdownToSafeHtml('<script>alert(1)</script>\n\n# Safe');
      expect(output).not.toContain('<script>');
      expect(output).toContain('Safe');
    });
  });
});
