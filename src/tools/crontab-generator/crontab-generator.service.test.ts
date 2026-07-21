import { describe, expect, it } from 'vitest';
import { getCronDescription, isCronValid } from './crontab-generator.service';

describe('crontab-generator', () => {
  describe('isCronValid', () => {
    it('validates standard 5-field crons', () => {
      expect(isCronValid('* * * * *')).toBe(true);
      expect(isCronValid('40 * * * *')).toBe(true);
      expect(isCronValid('*/5 * * * *')).toBe(true);
      expect(isCronValid('0 0 1 1 *')).toBe(true);
      expect(isCronValid('1-10 * * * *')).toBe(true);
      expect(isCronValid('1,10 * * * *')).toBe(true);
    });

    it('validates crons with seconds', () => {
      expect(isCronValid('* * * * * *')).toBe(true);
      expect(isCronValid('0 0 12 * * *')).toBe(true);
    });

    it('validates crons with aliases', () => {
      expect(isCronValid('0 0 * * mon')).toBe(true);
      expect(isCronValid('0 0 1 jan *')).toBe(true);
    });

    it('rejects invalid crons', () => {
      expect(isCronValid('')).toBe(false);
      expect(isCronValid('foo')).toBe(false);
      expect(isCronValid('* * *')).toBe(false);
      expect(isCronValid('60 * * * *')).toBe(false);
      expect(isCronValid('* 24 * * *')).toBe(false);
      expect(isCronValid('* * 32 * *')).toBe(false);
      expect(isCronValid('* * * 13 *')).toBe(false);
      expect(isCronValid('* * * * * * *')).toBe(false);
    });
  });

  describe('getCronDescription', () => {
    const defaultConfig = {
      verbose: true,
      dayOfWeekStartIndexZero: true,
      use24HourTimeFormat: true,
      throwExceptionOnParseError: true,
    };

    it('describes known schedules', () => {
      expect(getCronDescription('40 * * * *', defaultConfig)).toBe('At 40 minutes past the hour, every hour, every day');
      expect(getCronDescription('* * * * *', defaultConfig)).toBe('Every minute, every hour, every day');
      expect(getCronDescription('*/5 * * * *', defaultConfig)).toBe('Every 5 minutes, every hour, every day');
      expect(getCronDescription('0 9 * * 1-5', defaultConfig)).toBe('At 09:00, Monday through Friday');
    });

    it('returns a blank string for @-shorthands, which cron-validator does not support', () => {
      expect(isCronValid('@hourly')).toBe(false);
      expect(getCronDescription('@hourly', defaultConfig)).toBe(' ');
    });

    it('honors the use24HourTimeFormat option', () => {
      expect(getCronDescription('0 0 * * *', { use24HourTimeFormat: true })).toBe('At 00:00');
      expect(getCronDescription('0 0 * * *', { use24HourTimeFormat: false })).toBe('At 12:00 AM');
    });

    it('describes crons without any config', () => {
      expect(getCronDescription('0 0 * * *')).toBe('At 12:00 AM');
    });

    it('returns a blank string for invalid crons', () => {
      expect(getCronDescription('invalid', defaultConfig)).toBe(' ');
      expect(getCronDescription('* * *', defaultConfig)).toBe(' ');
      expect(getCronDescription('', defaultConfig)).toBe(' ');
    });
  });
});
