import { describe, expect, it } from 'vitest';
import { getContrastRatio, getWcagCompliance, isValidColor } from './color-contrast-checker.service';

describe('color-contrast-checker', () => {
  describe('getContrastRatio', () => {
    it('returns 21 for black on white', () => {
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
    });

    it('returns 1 for identical colors', () => {
      expect(getContrastRatio('#ff0000', '#ff0000')).toBe(1);
    });

    it('is symmetric regardless of argument order', () => {
      expect(getContrastRatio('#333333', '#ffffff')).toBe(getContrastRatio('#ffffff', '#333333'));
    });

    it('parses named and rgb color notations', () => {
      expect(getContrastRatio('black', 'white')).toBe(21);
      expect(getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBe(21);
    });
  });

  describe('getWcagCompliance', () => {
    it('marks a 21:1 ratio as passing every level', () => {
      expect(getWcagCompliance(21)).toEqual({
        normalAa: true,
        normalAaa: true,
        largeAa: true,
        largeAaa: true,
      });
    });

    it('marks a 1:1 ratio as failing every level', () => {
      expect(getWcagCompliance(1)).toEqual({
        normalAa: false,
        normalAaa: false,
        largeAa: false,
        largeAaa: false,
      });
    });

    it('applies the WCAG thresholds at the boundaries', () => {
      // 4.5 passes normal AA and large AAA, but not normal AAA.
      expect(getWcagCompliance(4.5)).toEqual({
        normalAa: true,
        normalAaa: false,
        largeAa: true,
        largeAaa: true,
      });
      // 3 passes only large AA.
      expect(getWcagCompliance(3)).toEqual({
        normalAa: false,
        normalAaa: false,
        largeAa: true,
        largeAaa: false,
      });
      // 7 passes everything.
      expect(getWcagCompliance(7).normalAaa).toBe(true);
    });
  });

  describe('isValidColor', () => {
    it('accepts valid color notations', () => {
      expect(isValidColor('#ffffff')).toBe(true);
      expect(isValidColor('rgb(1, 2, 3)')).toBe(true);
      expect(isValidColor('red')).toBe(true);
    });

    it('rejects invalid color strings', () => {
      expect(isValidColor('not-a-color')).toBe(false);
      expect(isValidColor('')).toBe(false);
    });
  });
});
