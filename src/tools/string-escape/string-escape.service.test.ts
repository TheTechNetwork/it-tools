import { describe, expect, it } from 'vitest';
import { escapeString, unescapeString } from './string-escape.service';

describe('string-escape', () => {
  describe('escapeString', () => {
    it('escapes quotes and backslashes', () => {
      expect(escapeString('say "hi"')).toBe('say \\"hi\\"');
      expect(escapeString('a\\b')).toBe('a\\\\b');
    });

    it('escapes whitespace control characters', () => {
      expect(escapeString('line1\nline2\ttab')).toBe('line1\\nline2\\ttab');
      expect(escapeString('\r\b\f')).toBe('\\r\\b\\f');
    });

    it('escapes other control characters as \\uXXXX', () => {
      const input = String.fromCharCode(0x00) + String.fromCharCode(0x1F);
      expect(escapeString(input)).toBe('\\u0000\\u001f');
    });

    it('leaves printable and unicode characters untouched', () => {
      expect(escapeString('Hello, 世界! 😀')).toBe('Hello, 世界! 😀');
    });
  });

  describe('unescapeString', () => {
    it('unescapes quotes and backslashes', () => {
      expect(unescapeString('say \\"hi\\"')).toBe('say "hi"');
      expect(unescapeString('a\\\\b')).toBe('a\\b');
    });

    it('unescapes whitespace escapes', () => {
      expect(unescapeString('line1\\nline2\\ttab')).toBe('line1\nline2\ttab');
    });

    it('unescapes \\uXXXX and \\xXX sequences', () => {
      expect(unescapeString('\\u0041\\u0042')).toBe('AB');
      expect(unescapeString('\\x41')).toBe('A');
    });

    it('keeps unknown escapes as the literal character', () => {
      expect(unescapeString('\\q')).toBe('q');
    });

    it('handles a trailing lone backslash', () => {
      expect(unescapeString('abc\\')).toBe('abc\\');
    });

    it('leaves malformed unicode escapes as-is', () => {
      expect(unescapeString('\\uZZZZ')).toBe('uZZZZ');
    });
  });

  it('round-trips through escape and unescape', () => {
    const original = 'Tabs\tnewlines\nquotes " and backslashes \\ and unicode 😀';
    expect(unescapeString(escapeString(original))).toBe(original);
  });
});
