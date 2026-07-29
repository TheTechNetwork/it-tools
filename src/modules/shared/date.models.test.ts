import { describe, expect, it } from 'vitest';
import { getUrlFriendlyDateTime } from './date.models';

describe('date.models', () => {
  describe('getUrlFriendlyDateTime', () => {
    it('formats a given date as yyyy-MM-dd-HH-mm-ss in local time', () => {
      // Constructed with local-time fields so the formatted output is
      // independent of the (Europe/Paris) test timezone.
      const date = new Date(2023, 0, 15, 14, 30, 45);
      expect(getUrlFriendlyDateTime({ date })).toBe('2023-01-15-14-30-45');
    });

    it('zero-pads single-digit components', () => {
      const date = new Date(2024, 2, 5, 9, 7, 3);
      expect(getUrlFriendlyDateTime({ date })).toBe('2024-03-05-09-07-03');
    });

    it('defaults to the current date when no argument is given', () => {
      expect(getUrlFriendlyDateTime()).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/);
    });

    it('defaults to the current date when called with an empty options object', () => {
      expect(getUrlFriendlyDateTime({})).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/);
    });
  });
});
