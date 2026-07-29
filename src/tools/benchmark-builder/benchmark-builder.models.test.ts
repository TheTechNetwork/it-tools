import { describe, expect, it } from 'vitest';
import { arrayToMarkdownTable, computeAverage, computeVariance } from './benchmark-builder.models';

describe('benchmark-builder.models', () => {
  describe('computeAverage', () => {
    it('returns 0 for an empty dataset', () => {
      expect(computeAverage({ data: [] })).toBe(0);
    });

    it('computes the mean of a dataset', () => {
      expect(computeAverage({ data: [2, 4, 6] })).toBe(4);
      expect(computeAverage({ data: [10] })).toBe(10);
      expect(computeAverage({ data: [1, 2] })).toBe(1.5);
    });

    it('handles negative values', () => {
      expect(computeAverage({ data: [-2, 2] })).toBe(0);
      expect(computeAverage({ data: [-4, -6] })).toBe(-5);
    });
  });

  describe('computeVariance', () => {
    it('is 0 for a constant dataset', () => {
      expect(computeVariance({ data: [5, 5, 5] })).toBe(0);
    });

    it('is 0 for an empty dataset (mean is 0)', () => {
      expect(computeVariance({ data: [] })).toBe(0);
    });

    it('computes the population variance', () => {
      // mean = 4, squared diffs = [4, 0, 4], variance = 8/3
      expect(computeVariance({ data: [2, 4, 6] })).toBeCloseTo(8 / 3, 10);
      // mean = 5, squared diffs = [9, 1, 1, 9], variance = 20/4 = 5
      expect(computeVariance({ data: [2, 4, 6, 8] })).toBe(5);
    });
  });

  describe('arrayToMarkdownTable', () => {
    it('returns an empty string for a non-array input', () => {
      expect(arrayToMarkdownTable({ data: null as unknown as Record<string, unknown>[] })).toBe('');
      expect(arrayToMarkdownTable({ data: undefined as unknown as Record<string, unknown>[] })).toBe('');
    });

    it('returns an empty string for an empty array', () => {
      expect(arrayToMarkdownTable({ data: [] })).toBe('');
    });

    it('returns an empty string when the first row is missing', () => {
      expect(arrayToMarkdownTable({ data: [undefined as unknown as Record<string, unknown>] })).toBe('');
    });

    it('builds a markdown table from an array of objects', () => {
      const result = arrayToMarkdownTable({ data: [
        { name: 'a', score: 1 },
        { name: 'b', score: 2 },
      ] });

      expect(result).toBe(
        '| name | score |\n'
        + '| --- | --- |\n'
        + '| a | 1 |\n'
        + '| b | 2 |',
      );
    });

    it('applies the header map when provided, falling back to the raw key', () => {
      const result = arrayToMarkdownTable({
        data: [{ name: 'a', score: 1 }],
        headerMap: { name: 'Name' },
      });

      expect(result).toBe(
        '| Name | score |\n'
        + '| --- | --- |\n'
        + '| a | 1 |',
      );
    });

    it('derives headers from the first row', () => {
      const result = arrayToMarkdownTable({ data: [{ col: 'x' }] });
      expect(result).toBe('| col |\n| --- |\n| x |');
    });
  });
});
