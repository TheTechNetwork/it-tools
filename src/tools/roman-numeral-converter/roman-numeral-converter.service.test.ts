import { describe, expect, it } from 'vitest';
import { arabicToRoman, isValidRomanNumber, romanToArabic } from './roman-numeral-converter.service';

describe('roman-numeral-converter', () => {
  describe('arabicToRoman', () => {
    it('should convert numbers lower than 1 to empty string', () => {
      expect(arabicToRoman(-100)).toEqual('');
      expect(arabicToRoman(-42)).toEqual('');
      expect(arabicToRoman(-26)).toEqual('');
      expect(arabicToRoman(-10)).toEqual('');
      expect(arabicToRoman(0)).toEqual('');
      expect(arabicToRoman(0.5)).toEqual('');
      expect(arabicToRoman(0.9)).toEqual('');
    });

    it('should convert numbers greater than 3999 to empty string', () => {
      expect(arabicToRoman(3999.1)).toEqual('');
      expect(arabicToRoman(4000)).toEqual('');
      expect(arabicToRoman(10000)).toEqual('');
    });

    it('should convert floating points number to the lower integer in roman version', () => {
      expect(arabicToRoman(1.1)).toEqual('I');
      expect(arabicToRoman(1.9)).toEqual('I');
      expect(arabicToRoman(17.6)).toEqual('XVII');
      expect(arabicToRoman(29.999)).toEqual('XXIX');
    });

    it('should convert positive integers to roman numbers', () => {
      expect(arabicToRoman(1)).toEqual('I');
      expect(arabicToRoman(2)).toEqual('II');
      expect(arabicToRoman(3)).toEqual('III');
      expect(arabicToRoman(4)).toEqual('IV');
      expect(arabicToRoman(5)).toEqual('V');
      expect(arabicToRoman(6)).toEqual('VI');
      expect(arabicToRoman(7)).toEqual('VII');
      expect(arabicToRoman(8)).toEqual('VIII');
      expect(arabicToRoman(9)).toEqual('IX');
      expect(arabicToRoman(10)).toEqual('X');
      expect(arabicToRoman(11)).toEqual('XI');
      expect(arabicToRoman(12)).toEqual('XII');
      expect(arabicToRoman(13)).toEqual('XIII');
      expect(arabicToRoman(14)).toEqual('XIV');
      expect(arabicToRoman(15)).toEqual('XV');
      expect(arabicToRoman(16)).toEqual('XVI');
      expect(arabicToRoman(17)).toEqual('XVII');
      expect(arabicToRoman(18)).toEqual('XVIII');
      expect(arabicToRoman(19)).toEqual('XIX');
      expect(arabicToRoman(20)).toEqual('XX');
      expect(arabicToRoman(21)).toEqual('XXI');
      expect(arabicToRoman(24)).toEqual('XXIV');
      expect(arabicToRoman(28)).toEqual('XXVIII');
      expect(arabicToRoman(29)).toEqual('XXIX');
      expect(arabicToRoman(30)).toEqual('XXX');
      expect(arabicToRoman(40)).toEqual('XL');
      expect(arabicToRoman(50)).toEqual('L');
      expect(arabicToRoman(60)).toEqual('LX');
      expect(arabicToRoman(70)).toEqual('LXX');
      expect(arabicToRoman(80)).toEqual('LXXX');
      expect(arabicToRoman(90)).toEqual('XC');
      expect(arabicToRoman(100)).toEqual('C');
      expect(arabicToRoman(200)).toEqual('CC');
      expect(arabicToRoman(300)).toEqual('CCC');
      expect(arabicToRoman(400)).toEqual('CD');
      expect(arabicToRoman(500)).toEqual('D');
      expect(arabicToRoman(600)).toEqual('DC');
      expect(arabicToRoman(700)).toEqual('DCC');
      expect(arabicToRoman(800)).toEqual('DCCC');
      expect(arabicToRoman(900)).toEqual('CM');
      expect(arabicToRoman(999)).toEqual('CMXCIX');
      expect(arabicToRoman(1000)).toEqual('M');
      expect(arabicToRoman(2000)).toEqual('MM');
    });

    it('converts the maximum and minimum in-range values', () => {
      expect(arabicToRoman(1)).toEqual('I');
      expect(arabicToRoman(3999)).toEqual('MMMCMXCIX');
    });
  });

  describe('isValidRomanNumber', () => {
    it('accepts well-formed roman numbers', () => {
      expect(isValidRomanNumber('I')).toBe(true);
      expect(isValidRomanNumber('IV')).toBe(true);
      expect(isValidRomanNumber('MCMXCIV')).toBe(true);
      expect(isValidRomanNumber('MMMCMXCIX')).toBe(true);
      // The regex treats an empty string as a valid (zero-length) roman number.
      expect(isValidRomanNumber('')).toBe(true);
    });

    it('rejects malformed roman numbers', () => {
      expect(isValidRomanNumber('IIII')).toBe(false);
      expect(isValidRomanNumber('VV')).toBe(false);
      expect(isValidRomanNumber('IC')).toBe(false);
      expect(isValidRomanNumber('MMMM')).toBe(false);
      expect(isValidRomanNumber('abc')).toBe(false);
      expect(isValidRomanNumber('XIauie')).toBe(false);
    });
  });

  describe('romanToArabic', () => {
    it('returns null for invalid roman numbers', () => {
      expect(romanToArabic('IIII')).toBeNull();
      expect(romanToArabic('foobar')).toBeNull();
      expect(romanToArabic('VX')).toBeNull();
    });

    it('converts additive roman numbers', () => {
      expect(romanToArabic('I')).toBe(1);
      expect(romanToArabic('III')).toBe(3);
      expect(romanToArabic('VI')).toBe(6);
      expect(romanToArabic('MMXXIII')).toBe(2023);
    });

    it('converts subtractive roman numbers', () => {
      expect(romanToArabic('IV')).toBe(4);
      expect(romanToArabic('IX')).toBe(9);
      expect(romanToArabic('XL')).toBe(40);
      expect(romanToArabic('XC')).toBe(90);
      expect(romanToArabic('CD')).toBe(400);
      expect(romanToArabic('CM')).toBe(900);
      expect(romanToArabic('MCMXCIV')).toBe(1994);
    });

    it('converts the maximum roman number', () => {
      expect(romanToArabic('MMMCMXCIX')).toBe(3999);
    });

    it('treats an empty (valid) roman number as zero', () => {
      expect(romanToArabic('')).toBe(0);
    });

    it('round-trips every in-range value', () => {
      for (let n = 1; n <= 3999; n++) {
        expect(romanToArabic(arabicToRoman(n))).toBe(n);
      }
    });
  });
});
