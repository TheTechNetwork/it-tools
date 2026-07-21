import { describe, expect, it } from 'vitest';
import { convertMarkdownToHtml } from './markdown-to-html.service';

describe('markdown-to-html', () => {
  describe('convertMarkdownToHtml', () => {
    it('converts headings', () => {
      expect(convertMarkdownToHtml('# Title')).toBe('<h1>Title</h1>\n');
      expect(convertMarkdownToHtml('## Subtitle')).toBe('<h2>Subtitle</h2>\n');
    });

    it('converts paragraphs', () => {
      expect(convertMarkdownToHtml('hello world')).toBe('<p>hello world</p>\n');
    });

    it('converts emphasis and strong text', () => {
      expect(convertMarkdownToHtml('*italic* and **bold**')).toBe('<p><em>italic</em> and <strong>bold</strong></p>\n');
    });

    it('converts links', () => {
      expect(convertMarkdownToHtml('[IT Tools](https://it-tools.tech)')).toBe(
        '<p><a href="https://it-tools.tech">IT Tools</a></p>\n',
      );
    });

    it('converts unordered lists', () => {
      expect(convertMarkdownToHtml('- one\n- two')).toBe('<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n');
    });

    it('converts inline code and code blocks', () => {
      expect(convertMarkdownToHtml('`code`')).toBe('<p><code>code</code></p>\n');
      expect(convertMarkdownToHtml('```\nconst a = 1;\n```')).toBe('<pre><code>const a = 1;\n</code></pre>\n');
    });

    it('converts blockquotes', () => {
      expect(convertMarkdownToHtml('> quoted')).toBe('<blockquote>\n<p>quoted</p>\n</blockquote>\n');
    });

    it('escapes raw html by default', () => {
      expect(convertMarkdownToHtml('<script>alert(1)</script>')).not.toContain('<script>');
      expect(convertMarkdownToHtml('<script>alert(1)</script>')).toContain('&lt;script&gt;');
    });

    it('keeps unicode characters', () => {
      expect(convertMarkdownToHtml('déjà vu 汉字 👍')).toBe('<p>déjà vu 汉字 👍</p>\n');
    });

    it('handles an empty string', () => {
      expect(convertMarkdownToHtml('')).toBe('');
    });
  });
});
