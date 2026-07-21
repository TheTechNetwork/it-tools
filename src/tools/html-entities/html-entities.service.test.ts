import { describe, expect, it } from 'vitest';
import { escapeHtmlEntities, unescapeHtmlEntities } from './html-entities.service';

describe('html-entities', () => {
  describe('escapeHtmlEntities', () => {
    it('escapes html tags', () => {
      expect(escapeHtmlEntities('<title>IT Tool</title>')).toBe('&lt;title&gt;IT Tool&lt;/title&gt;');
    });

    it('escapes ampersands', () => {
      expect(escapeHtmlEntities('fish & chips')).toBe('fish &amp; chips');
    });

    it('escapes double and single quotes', () => {
      expect(escapeHtmlEntities('"double" and \'single\'')).toBe('&quot;double&quot; and &#39;single&#39;');
    });

    it('leaves text without special characters untouched', () => {
      expect(escapeHtmlEntities('hello world 123')).toBe('hello world 123');
    });

    it('leaves unicode characters untouched', () => {
      expect(escapeHtmlEntities('déjà vu 汉字 👍')).toBe('déjà vu 汉字 👍');
    });

    it('handles an empty string', () => {
      expect(escapeHtmlEntities('')).toBe('');
    });
  });

  describe('unescapeHtmlEntities', () => {
    it('unescapes html tags', () => {
      expect(unescapeHtmlEntities('&lt;title&gt;IT Tool&lt;/title&gt;')).toBe('<title>IT Tool</title>');
    });

    it('unescapes ampersands', () => {
      expect(unescapeHtmlEntities('fish &amp; chips')).toBe('fish & chips');
    });

    it('unescapes double and single quotes', () => {
      expect(unescapeHtmlEntities('&quot;double&quot; and &#39;single&#39;')).toBe('"double" and \'single\'');
    });

    it('leaves unknown entities untouched', () => {
      expect(unescapeHtmlEntities('&copy; &nbsp;')).toBe('&copy; &nbsp;');
    });

    it('leaves plain text untouched', () => {
      expect(unescapeHtmlEntities('hello world')).toBe('hello world');
    });

    it('handles an empty string', () => {
      expect(unescapeHtmlEntities('')).toBe('');
    });
  });

  describe('round-trips', () => {
    it.each([
      '<title>IT Tool</title>',
      '<a href="https://example.com?a=1&b=2">link</a>',
      'a & b < c > d "quoted" \'single\'',
      'plain text',
      'déjà vu 汉字 👍',
      '',
    ])('unescape(escape(%j)) returns the original string', (input) => {
      expect(unescapeHtmlEntities(escapeHtmlEntities(input))).toBe(input);
    });
  });
});
