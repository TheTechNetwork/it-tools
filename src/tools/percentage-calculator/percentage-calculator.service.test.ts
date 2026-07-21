import { describe, expect, it } from 'vitest';
import { calculatePercentageChange, calculatePercentageOfNumber, calculateWhatPercentageOf } from './percentage-calculator.service';

describe('percentage-calculator', () => {
  describe('calculatePercentageOfNumber', () => {
    it('computes X% of Y', () => {
      expect(calculatePercentageOfNumber({ percentage: 50, value: 200 })).toBe('100');
      expect(calculatePercentageOfNumber({ percentage: 10, value: 150 })).toBe('15');
      expect(calculatePercentageOfNumber({ percentage: 123, value: 456 })).toBe('560.88');
    });

    it('handles zero and negative values', () => {
      expect(calculatePercentageOfNumber({ percentage: 0, value: 200 })).toBe('0');
      expect(calculatePercentageOfNumber({ percentage: 50, value: 0 })).toBe('0');
      expect(calculatePercentageOfNumber({ percentage: -50, value: 200 })).toBe('-100');
    });

    it('handles percentages above 100', () => {
      expect(calculatePercentageOfNumber({ percentage: 200, value: 30 })).toBe('60');
    });
  });

  describe('calculateWhatPercentageOf', () => {
    it('computes what percent X is of Y', () => {
      expect(calculateWhatPercentageOf({ value: 50, total: 200 })).toBe('25');
      expect(calculateWhatPercentageOf({ value: 200, total: 50 })).toBe('400');
      expect(calculateWhatPercentageOf({ value: 123, total: 456 })).toBe('26.973684210526315');
    });

    it('returns an empty string when the result is not finite', () => {
      expect(calculateWhatPercentageOf({ value: 50, total: 0 })).toBe('');
      expect(calculateWhatPercentageOf({ value: 0, total: 0 })).toBe('');
    });

    it('handles zero value', () => {
      expect(calculateWhatPercentageOf({ value: 0, total: 100 })).toBe('0');
    });
  });

  describe('calculatePercentageChange', () => {
    it('computes percentage increase', () => {
      expect(calculatePercentageChange({ from: 100, to: 150 })).toBe('50');
      expect(calculatePercentageChange({ from: 123, to: 456 })).toBe('270.7317073170732');
    });

    it('computes percentage decrease', () => {
      expect(calculatePercentageChange({ from: 100, to: 50 })).toBe('-50');
      expect(calculatePercentageChange({ from: 200, to: 0 })).toBe('-100');
    });

    it('returns 0 for identical values', () => {
      expect(calculatePercentageChange({ from: 42, to: 42 })).toBe('0');
    });

    it('returns an empty string when the result is not finite', () => {
      expect(calculatePercentageChange({ from: 0, to: 100 })).toBe('');
      expect(calculatePercentageChange({ from: 0, to: 0 })).toBe('');
    });
  });
});
