import { describe, expect, it } from 'vitest';
import { decodeUrlString, encodeUrlString } from './url-encoder.service';

describe('url-encoder', () => {
  describe('encodeUrlString', () => {
    it('encodes reserved characters', () => {
      expect(encodeUrlString('Hello world :)')).toBe('Hello%20world%20%3A)');
      expect(encodeUrlString('a=b&c=d')).toBe('a%3Db%26c%3Dd');
      expect(encodeUrlString('100% free?')).toBe('100%25%20free%3F');
    });

    it('leaves unreserved characters untouched', () => {
      expect(encodeUrlString('AZaz09-_.!~*\'()')).toBe('AZaz09-_.!~*\'()');
    });

    it('encodes unicode characters', () => {
      expect(encodeUrlString('déjà vu')).toBe('d%C3%A9j%C3%A0%20vu');
      expect(encodeUrlString('汉字')).toBe('%E6%B1%89%E5%AD%97');
      expect(encodeUrlString('👍')).toBe('%F0%9F%91%8D');
    });

    it('handles an empty string', () => {
      expect(encodeUrlString('')).toBe('');
    });

    it('throws on lone surrogates', () => {
      expect(() => encodeUrlString('\uD800')).toThrow();
    });
  });

  describe('decodeUrlString', () => {
    it('decodes percent-encoded characters', () => {
      expect(decodeUrlString('Hello%20world%20%3A)')).toBe('Hello world :)');
      expect(decodeUrlString('a%3Db%26c%3Dd')).toBe('a=b&c=d');
    });

    it('decodes unicode sequences', () => {
      expect(decodeUrlString('d%C3%A9j%C3%A0%20vu')).toBe('déjà vu');
      expect(decodeUrlString('%E6%B1%89%E5%AD%97')).toBe('汉字');
    });

    it('leaves plain text untouched', () => {
      expect(decodeUrlString('hello')).toBe('hello');
    });

    it('does not treat plus signs as spaces', () => {
      expect(decodeUrlString('a+b')).toBe('a+b');
    });

    it('handles an empty string', () => {
      expect(decodeUrlString('')).toBe('');
    });

    it('throws on malformed sequences', () => {
      expect(() => decodeUrlString('%')).toThrow();
      expect(() => decodeUrlString('%E0%A4%A')).toThrow();
    });
  });

  describe('round-trips', () => {
    it.each([
      'Hello world :)',
      'a=b&c=d#hash',
      'déjà vu à la crème',
      '汉字テスト한국어',
      '👍🏽 emoji with modifier',
      'https://user:pass@example.com:8080/path?query=value#hash',
      'spaces   and\ttabs\nand newlines',
      '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~\\',
    ])('decode(encode(%j)) returns the original string', (input) => {
      expect(decodeUrlString(encodeUrlString(input))).toBe(input);
    });
  });
});
