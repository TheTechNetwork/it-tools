import { describe, expect, it } from 'vitest';
import { obfuscateString, useObfuscateString } from './string-obfuscator.model';

describe('string-obfuscator model', () => {
  describe('obfuscateString', () => {
    it('the characters in the middle of the string are replaced by the replacement character', () => {
      expect(obfuscateString('1234567890')).toBe('1234******');
      expect(obfuscateString('1234567890', { replacementChar: 'x' })).toBe('1234xxxxxx');
      expect(obfuscateString('1234567890', { keepFirst: 5 })).toBe('12345*****');
      expect(obfuscateString('1234567890', { keepFirst: 0, keepLast: 5 })).toBe('*****67890');
      expect(obfuscateString('1234567890', { keepFirst: 5, keepLast: 5 })).toBe('1234567890');
      expect(obfuscateString('1234567890', { keepFirst: 2, keepLast: 2, replacementChar: 'x' })).toBe('12xxxxxx90');
    });

    it('by default, the spaces are kept, they can be removed with the keepSpace option', () => {
      expect(obfuscateString('12345 67890')).toBe('1234* *****');
      expect(obfuscateString('12345 67890', { keepSpace: false })).toBe('1234*******');
    });
  });

  describe('useObfuscateString', () => {
    it('obfuscates using the default options when the config argument is omitted', () => {
      const result = useObfuscateString('1234567890');

      expect(result.value).toBe('1234******');
    });

    it('unwraps the provided reactive config options', () => {
      const result = useObfuscateString('1234567890', { keepFirst: 2, keepLast: 2, replacementChar: 'x' });

      expect(result.value).toBe('12xxxxxx90');
    });
  });
});
