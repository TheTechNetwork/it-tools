import { describe, expect, it } from 'vitest';
import { convertDataSize } from './data-storage-converter.service';

describe('data-storage-converter', () => {
  describe('convertDataSize', () => {
    it('converts bytes to bits', () => {
      expect(convertDataSize({ value: 1, from: 'byte', to: 'bit' })).toBe(8);
    });

    it('converts within the SI (decimal) scale', () => {
      expect(convertDataSize({ value: 1, from: 'megabyte', to: 'kilobyte' })).toBe(1000);
      expect(convertDataSize({ value: 1, from: 'gigabyte', to: 'byte' })).toBe(1e9);
    });

    it('converts within the IEC (binary) scale', () => {
      expect(convertDataSize({ value: 1, from: 'mebibyte', to: 'kibibyte' })).toBe(1024);
      expect(convertDataSize({ value: 1, from: 'gibibyte', to: 'byte' })).toBe(1024 ** 3);
    });

    it('converts between decimal and binary units', () => {
      expect(convertDataSize({ value: 1, from: 'kibibyte', to: 'kilobyte' })).toBe(1.024);
    });

    it('returns the same value when units match', () => {
      expect(convertDataSize({ value: 42, from: 'megabyte', to: 'megabyte' })).toBe(42);
    });

    it('throws on an unknown unit', () => {
      expect(() => convertDataSize({ value: 1, from: 'byte', to: 'furlong' })).toThrow('Unknown data unit: furlong');
    });
  });
});
