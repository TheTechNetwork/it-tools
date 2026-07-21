import { describe, expect, it } from 'vitest';
import {
  convertEntropyToMnemonic,
  convertMnemonicToEntropy,
  generateRandomEntropy,
  isEntropyHexadecimal,
  isEntropyLengthValid,
  languages,
} from './bip39-generator.service';

describe('bip39-generator', () => {
  describe('languages', () => {
    it('exposes the supported word lists', () => {
      expect(Object.keys(languages)).toEqual([
        'English',
        'Chinese simplified',
        'Chinese traditional',
        'Czech',
        'French',
        'Italian',
        'Japanese',
        'Korean',
        'Portuguese',
        'Spanish',
      ]);
    });
  });

  describe('generateRandomEntropy', () => {
    it('generates a 32 character hexadecimal string', () => {
      const entropy = generateRandomEntropy();

      expect(entropy).toMatch(/^[0-9a-f]{32}$/);
      expect(isEntropyLengthValid(entropy)).toBe(true);
      expect(isEntropyHexadecimal(entropy)).toBe(true);
    });

    it('generates a different entropy on each call', () => {
      expect(generateRandomEntropy()).not.toBe(generateRandomEntropy());
    });
  });

  describe('convertEntropyToMnemonic', () => {
    it('converts a known entropy to the reference english mnemonic', () => {
      expect(convertEntropyToMnemonic({ entropy: '00000000000000000000000000000000', language: 'English' })).toBe(
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      );
      expect(convertEntropyToMnemonic({ entropy: 'ffffffffffffffffffffffffffffffff', language: 'English' })).toBe(
        'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
      );
    });

    it('converts an entropy using the selected language word list', () => {
      const mnemonic = convertEntropyToMnemonic({
        entropy: '00000000000000000000000000000000',
        language: 'French',
      });

      expect(mnemonic.split(languages.French.spacer).every(word => languages.French.words.includes(word))).toBe(true);
    });

    it('throws for an invalid entropy', () => {
      expect(() => convertEntropyToMnemonic({ entropy: 'abcd', language: 'English' })).toThrow();
    });
  });

  describe('convertMnemonicToEntropy', () => {
    it('converts a known mnemonic back to its entropy', () => {
      expect(
        convertMnemonicToEntropy({
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
          language: 'English',
        }),
      ).toBe('00000000000000000000000000000000');
    });

    it('throws for a mnemonic with an invalid checksum', () => {
      expect(() =>
        convertMnemonicToEntropy({
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon',
          language: 'English',
        }),
      ).toThrow();
    });

    it('throws for a mnemonic with words outside of the word list', () => {
      expect(() => convertMnemonicToEntropy({ mnemonic: 'not a valid mnemonic', language: 'English' })).toThrow();
    });
  });

  describe('round trips', () => {
    it('round trips entropy -> mnemonic -> entropy for every language', () => {
      const entropy = generateRandomEntropy();

      for (const language of Object.keys(languages) as (keyof typeof languages)[]) {
        const mnemonic = convertEntropyToMnemonic({ entropy, language });

        expect(convertMnemonicToEntropy({ mnemonic, language })).toBe(entropy);
      }
    });
  });

  describe('isEntropyLengthValid', () => {
    it('accepts an empty entropy', () => {
      expect(isEntropyLengthValid('')).toBe(true);
    });

    it('accepts lengths between 16 and 32 that are multiples of 4', () => {
      expect(isEntropyLengthValid('a'.repeat(16))).toBe(true);
      expect(isEntropyLengthValid('a'.repeat(20))).toBe(true);
      expect(isEntropyLengthValid('a'.repeat(32))).toBe(true);
    });

    it('rejects invalid lengths', () => {
      expect(isEntropyLengthValid('a'.repeat(12))).toBe(false);
      expect(isEntropyLengthValid('a'.repeat(17))).toBe(false);
      expect(isEntropyLengthValid('a'.repeat(36))).toBe(false);
    });
  });

  describe('isEntropyHexadecimal', () => {
    it('accepts hexadecimal strings, case insensitively', () => {
      expect(isEntropyHexadecimal('')).toBe(true);
      expect(isEntropyHexadecimal('0123456789abcdef')).toBe(true);
      expect(isEntropyHexadecimal('ABCDEF0123456789')).toBe(true);
    });

    it('rejects non-hexadecimal strings', () => {
      expect(isEntropyHexadecimal('ghijkl')).toBe(false);
      expect(isEntropyHexadecimal('0123 4567')).toBe(false);
    });
  });
});
