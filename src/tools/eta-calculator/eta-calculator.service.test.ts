import { describe, expect, it } from 'vitest';
import { formatMsDuration } from './eta-calculator.service';

describe('eta-calculator', () => {
  describe('formatMsDuration', () => {
    it('formats seconds', () => {
      expect(formatMsDuration(1000)).toBe('1 second');
      expect(formatMsDuration(45000)).toBe('45 seconds');
    });

    it('formats minutes and seconds', () => {
      expect(formatMsDuration(90000)).toBe('1 minute 30 seconds');
      expect(formatMsDuration(60000)).toBe('1 minute');
    });

    it('formats hours, minutes and seconds', () => {
      expect(formatMsDuration(3600000)).toBe('1 hour');
      expect(formatMsDuration(3661000)).toBe('1 hour 1 minute 1 second');
      expect(formatMsDuration(7322000)).toBe('2 hours 2 minutes 2 seconds');
    });

    it('appends the remaining milliseconds when present', () => {
      expect(formatMsDuration(1500)).toBe('1 second 500 ms');
      expect(formatMsDuration(61250)).toBe('1 minute 1 second 250 ms');
    });

    it('does not append milliseconds when the duration is a whole number of seconds', () => {
      expect(formatMsDuration(2000)).not.toContain('ms');
    });

    it('handles durations larger than a day as hours', () => {
      expect(formatMsDuration(25 * 3600000)).toBe('25 hours');
    });
  });
});
