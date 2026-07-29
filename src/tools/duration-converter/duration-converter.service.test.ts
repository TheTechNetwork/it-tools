import { describe, expect, it } from 'vitest';
import { convertDuration, DURATION_UNITS, humanizeDuration } from './duration-converter.service';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

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

    it('throws on an unknown source unit, reporting the source', () => {
      expect(() => convertDuration({ value: 1, from: 'fortnight', to: 'second' })).toThrow('Unknown duration unit: fortnight');
    });

    it('throws on an unknown target unit, reporting the target', () => {
      expect(() => convertDuration({ value: 1, from: 'second', to: 'fortnight' })).toThrow('Unknown duration unit: fortnight');
    });

    it('returns the same value when converting between identical units', () => {
      expect(convertDuration({ value: 42, from: 'hour', to: 'hour' })).toBe(42);
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

    it('keeps the sign for negative sub-millisecond durations', () => {
      expect(humanizeDuration({ value: -500, from: 'nanosecond' })).toBe('-less than 1 millisecond');
    });

    it('builds a full breakdown across all units', () => {
      const oneOfEach = WEEK_MS + DAY_MS + HOUR_MS + MINUTE_MS + SECOND_MS + 1;
      expect(humanizeDuration({ value: oneOfEach, from: 'millisecond' })).toBe(
        '1 week, 1 day, 1 hour, 1 minute, 1 second, 1 millisecond',
      );
    });

    it('throws on an unknown unit', () => {
      expect(() => humanizeDuration({ value: 1, from: 'fortnight' })).toThrow('Unknown duration unit: fortnight');
    });
  });

  describe('duration units table', () => {
    it('exposes the supported units with unique keys', () => {
      const keys = DURATION_UNITS.map(unit => unit.key);
      expect(keys).toEqual([
        'nanosecond',
        'microsecond',
        'millisecond',
        'second',
        'minute',
        'hour',
        'day',
        'week',
      ]);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it('defines each unit in ascending millisecond order', () => {
      const ms = DURATION_UNITS.map(unit => unit.milliseconds);
      const sorted = [...ms].sort((a, b) => a - b);
      expect(ms).toEqual(sorted);
    });
  });
});
