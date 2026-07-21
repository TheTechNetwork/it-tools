import { describe, expect, it } from 'vitest';
import { formatBytes } from './convert';

describe('convert utils', () => {
  describe('formatBytes', () => {
    it('returns "0 Bytes" for zero', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('formats values under 1024 as bytes', () => {
      expect(formatBytes(1)).toBe('1 Bytes');
      expect(formatBytes(512)).toBe('512 Bytes');
      expect(formatBytes(1023)).toBe('1023 Bytes');
    });

    it('formats each unit boundary', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 ** 2)).toBe('1 MB');
      expect(formatBytes(1024 ** 3)).toBe('1 GB');
      expect(formatBytes(1024 ** 4)).toBe('1 TB');
      expect(formatBytes(1024 ** 5)).toBe('1 PB');
      expect(formatBytes(1024 ** 6)).toBe('1 EB');
      expect(formatBytes(1024 ** 7)).toBe('1 ZB');
      expect(formatBytes(1024 ** 8)).toBe('1 YB');
    });

    it('rounds to two decimals by default', () => {
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1234)).toBe('1.21 KB');
      expect(formatBytes(1024 * 1024 * 1.25)).toBe('1.25 MB');
    });

    it('honors the decimals parameter', () => {
      expect(formatBytes(1234, 0)).toBe('1 KB');
      expect(formatBytes(1234, 1)).toBe('1.2 KB');
      expect(formatBytes(1234, 3)).toBe('1.205 KB');
    });

    it('drops trailing zeros in the decimal part', () => {
      expect(formatBytes(2048)).toBe('2 KB');
      expect(formatBytes(2048, 4)).toBe('2 KB');
    });
  });
});
