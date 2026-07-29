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

    it('unescapes backspace, form-feed and carriage-return escapes', () => {
      expect(unescapeString('\\b\\f\\r')).toBe('\b\f\r');
    });

    it('unescapes escaped single quotes and forward slashes', () => {
      expect(unescapeString('it\\\'s')).toBe('it\'s');
      expect(unescapeString('a\\/b')).toBe('a/b');
    });

    it('leaves characters without a preceding backslash untouched', () => {
      expect(unescapeString('plain text 123')).toBe('plain text 123');
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
      expect(unescapeString('\\u12')).toBe('u12');
    });

    it('unescapes mixed-case hex in \\uXXXX and \\xXX sequences', () => {
      expect(unescapeString('\\u00E9')).toBe('é');
      expect(unescapeString('\\xE9')).toBe('é');
    });

    it('leaves malformed hex escapes as-is', () => {
      expect(unescapeString('\\xZZ')).toBe('xZZ');
      expect(unescapeString('\\x4')).toBe('x4');
    });
  });

  it('round-trips through escape and unescape', () => {
    const original = 'Tabs\tnewlines\nquotes " and backslashes \\ and unicode 😀';
    expect(unescapeString(escapeString(original))).toBe(original);
  });
});
