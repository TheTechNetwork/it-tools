import { describe, expect, it } from 'vitest';
import { convertHtmlToMarkdown } from './html-to-markdown.service';

describe('html-to-markdown', () => {
  it('converts headings using ATX style', () => {
    expect(convertHtmlToMarkdown('<h1>Title</h1>')).toBe('# Title');
    expect(convertHtmlToMarkdown('<h2>Subtitle</h2>')).toBe('## Subtitle');
  });

  it('converts bold and italic text', () => {
    expect(convertHtmlToMarkdown('<p>a <strong>bold</strong> and <em>italic</em></p>')).toBe('a **bold** and *italic*');
  });

  it('converts links inline', () => {
    expect(convertHtmlToMarkdown('<a href="https://example.com">link</a>')).toBe('[link](https://example.com)');
  });

  it('converts unordered lists with a dash marker', () => {
    expect(convertHtmlToMarkdown('<ul><li>one</li><li>two</li></ul>')).toBe('-   one\n-   two');
  });

  it('converts fenced code blocks', () => {
    const result = convertHtmlToMarkdown('<pre><code>const a = 1;</code></pre>');

    expect(result).toContain('```');
    expect(result).toContain('const a = 1;');
  });

  it('strips script and style elements', () => {
    expect(convertHtmlToMarkdown('<p>keep</p><script>alert(1)</script><style>.x{}</style>')).toBe('keep');
  });

  it('returns an empty string for empty input', () => {
    expect(convertHtmlToMarkdown('')).toBe('');
  });
});
