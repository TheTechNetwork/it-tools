import { describe, expect, it } from 'vitest';
import { convertCssUnit } from './css-unit-converter.service';

describe('css-unit-converter', () => {
  describe('convertCssUnit', () => {
    it('returns the same value when units match', () => {
      expect(convertCssUnit({ value: 42, from: 'px', to: 'px' })).toBe(42);
    });

    it('converts px to rem/em using the base font size', () => {
      expect(convertCssUnit({ value: 16, from: 'px', to: 'rem' })).toBe(1);
      expect(convertCssUnit({ value: 32, from: 'px', to: 'em' })).toBe(2);
      expect(convertCssUnit({ value: 24, from: 'px', to: 'rem', baseFontSize: 12 })).toBe(2);
    });

    it('converts rem/em back to px', () => {
      expect(convertCssUnit({ value: 1.5, from: 'rem', to: 'px' })).toBe(24);
      expect(convertCssUnit({ value: 2, from: 'em', to: 'px', baseFontSize: 10 })).toBe(20);
    });

    it('treats percent as a fraction of the base font size', () => {
      expect(convertCssUnit({ value: 100, from: '%', to: 'px' })).toBe(16);
      expect(convertCssUnit({ value: 50, from: '%', to: 'px', baseFontSize: 20 })).toBe(10);
      expect(convertCssUnit({ value: 16, from: 'px', to: '%' })).toBe(100);
    });

    it('converts absolute units against the CSS reference (1in = 96px = 72pt)', () => {
      expect(convertCssUnit({ value: 1, from: 'in', to: 'px' })).toBe(96);
      expect(convertCssUnit({ value: 72, from: 'pt', to: 'px' })).toBe(96);
      expect(convertCssUnit({ value: 1, from: 'pc', to: 'px' })).toBe(16);
      expect(convertCssUnit({ value: 2.54, from: 'cm', to: 'px' })).toBeCloseTo(96, 6);
      expect(convertCssUnit({ value: 25.4, from: 'mm', to: 'px' })).toBeCloseTo(96, 6);
    });

    it('composes conversions across unrelated units', () => {
      // 72pt -> 96px -> 6rem at base 16
      expect(convertCssUnit({ value: 72, from: 'pt', to: 'rem' })).toBe(6);
    });

    it('returns NaN for invalid input or base font size', () => {
      expect(convertCssUnit({ value: Number.NaN, from: 'px', to: 'rem' })).toBeNaN();
      expect(convertCssUnit({ value: 10, from: 'px', to: 'rem', baseFontSize: 0 })).toBeNaN();
      expect(convertCssUnit({ value: 10, from: 'px', to: 'rem', baseFontSize: -5 })).toBeNaN();
    });
  });
});
