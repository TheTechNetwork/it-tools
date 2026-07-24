import { describe, expect, it } from 'vitest';
import { convertDuration, humanizeDuration } from './duration-converter.service';

describe('duration-converter', () => {
  describe('convertDuration', () => {
    it('converts seconds to milliseconds', () => {
      expect(convertDuration({ value: 1, from: 'second', to: 'millisecond' })).toBe(1000);
    });

    it('converts minutes to seconds', () => {
      expect(convertDuration({ value: 2, from: 'minute', to: 'second' })).toBe(120);
    });

    it('converts hours to days', () => {
      expect(convertDuration({ value: 12, from: 'hour', to: 'day' })).toBe(0.5);
    });

    it('converts days to weeks', () => {
      expect(convertDuration({ value: 14, from: 'day', to: 'week' })).toBe(2);
    });

    it('converts microseconds and nanoseconds', () => {
      expect(convertDuration({ value: 1, from: 'microsecond', to: 'nanosecond' })).toBeCloseTo(1000, 6);
      expect(convertDuration({ value: 1, from: 'millisecond', to: 'microsecond' })).toBeCloseTo(1000, 6);
    });

    it('throws on an unknown unit', () => {
      expect(() => convertDuration({ value: 1, from: 'second', to: 'fortnight' })).toThrow('Unknown duration unit: fortnight');
    });
  });

  describe('humanizeDuration', () => {
    it('breaks a duration into descending units', () => {
      expect(humanizeDuration({ value: 3661, from: 'second' })).toBe('1 hour, 1 minute, 1 second');
    });

    it('uses singular and plural correctly', () => {
      expect(humanizeDuration({ value: 1, from: 'second' })).toBe('1 second');
      expect(humanizeDuration({ value: 2, from: 'day' })).toBe('2 days');
    });

    it('handles weeks and days', () => {
      expect(humanizeDuration({ value: 10, from: 'day' })).toBe('1 week, 3 days');
    });

    it('handles zero', () => {
      expect(humanizeDuration({ value: 0, from: 'second' })).toBe('0 milliseconds');
    });

    it('keeps the sign for negative durations', () => {
      expect(humanizeDuration({ value: -90, from: 'second' })).toBe('-1 minute, 30 seconds');
    });

    it('reports sub-millisecond durations', () => {
      expect(humanizeDuration({ value: 500, from: 'nanosecond' })).toBe('less than 1 millisecond');
    });
  });
});
