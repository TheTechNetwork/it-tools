import { describe, expect, it } from 'vitest';
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';

describe('text-to-nato-alphabet', () => {
  describe('textToNatoAlphabet', () => {
    it('converts lowercase letters to their NATO word', () => {
      expect(textToNatoAlphabet({ text: 'abc' })).toBe('Alpha Bravo Charlie');
    });

    it('converts uppercase letters to their NATO word', () => {
      expect(textToNatoAlphabet({ text: 'XYZ' })).toBe('X-ray Yankee Zulu');
    });

    it('converts mixed case text', () => {
      expect(textToNatoAlphabet({ text: 'aZ' })).toBe('Alpha Zulu');
    });

    it('keeps non-letter characters as-is', () => {
      expect(textToNatoAlphabet({ text: 'a1!' })).toBe('Alpha 1 !');
    });

    it('keeps spaces between words', () => {
      expect(textToNatoAlphabet({ text: 'a b' })).toBe('Alpha   Bravo');
    });

    it('returns an empty string for an empty input', () => {
      expect(textToNatoAlphabet({ text: '' })).toBe('');
    });
  });
});
