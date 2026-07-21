import { describe, expect, it } from 'vitest';
import { slugifyString } from './slugify-string.service';

describe('slugify-string', () => {
  describe('slugifyString', () => {
    it('converts a simple sentence to a slug', () => {
      expect(slugifyString('My file path')).toBe('my-file-path');
    });

    it('handles an empty string', () => {
      expect(slugifyString('')).toBe('');
    });

    it('removes leading and trailing whitespace', () => {
      expect(slugifyString('  hello world  ')).toBe('hello-world');
    });

    it('collapses multiple separators', () => {
      expect(slugifyString('hello   world')).toBe('hello-world');
      expect(slugifyString('hello---world')).toBe('hello-world');
    });

    it('transliterates accented characters', () => {
      expect(slugifyString('déjà vu')).toBe('deja-vu');
      expect(slugifyString('crème brûlée')).toBe('creme-brulee');
    });

    it('transliterates german characters', () => {
      expect(slugifyString('ä ö ü ß')).toBe('ae-oe-ue-ss');
    });

    it('replaces ampersands with "and" and removes other special characters', () => {
      expect(slugifyString('fish & chips')).toBe('fish-and-chips');
      expect(slugifyString('hello!@#$%^*()world')).toBe('hello-world');
    });

    it('handles camelCase input by separating words', () => {
      expect(slugifyString('fooBar')).toBe('foo-bar');
    });

    it('keeps numbers', () => {
      expect(slugifyString('version 1 2 3')).toBe('version-1-2-3');
    });

    it('handles a string with only special characters', () => {
      expect(slugifyString('!@#$%')).toBe('');
    });
  });
});
