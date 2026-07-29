import { describe, expect, it } from 'vitest';
import { clamp } from './number.models';

describe('number.models', () => {
  describe('clamp', () => {
    it('returns the value unchanged when it is within the range', () => {
      expect(clamp({ value: 50 })).toBe(50);
      expect(clamp({ value: 5, min: 0, max: 10 })).toBe(5);
    });

    it('clamps to the max when the value is above the range', () => {
      expect(clamp({ value: 150 })).toBe(100);
      expect(clamp({ value: 42, min: 0, max: 10 })).toBe(10);
    });

    it('clamps to the min when the value is below the range', () => {
      expect(clamp({ value: -10 })).toBe(0);
      expect(clamp({ value: -5, min: 3, max: 10 })).toBe(3);
    });

    it('returns the boundary values as-is', () => {
      expect(clamp({ value: 0, min: 0, max: 10 })).toBe(0);
      expect(clamp({ value: 10, min: 0, max: 10 })).toBe(10);
    });

    it('uses the default min (0) and max (100) when omitted', () => {
      expect(clamp({ value: 100 })).toBe(100);
      expect(clamp({ value: 0 })).toBe(0);
    });

    it('supports negative ranges', () => {
      expect(clamp({ value: -50, min: -100, max: -10 })).toBe(-50);
      expect(clamp({ value: 0, min: -100, max: -10 })).toBe(-10);
      expect(clamp({ value: -200, min: -100, max: -10 })).toBe(-100);
    });
  });
});
