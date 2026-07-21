import { describe, expect, it } from 'vitest';
import { byOrder } from './array';

describe('array utils', () => {
  describe('byOrder', () => {
    it('sorts strings in ascending order when order is asc', () => {
      expect(['banana', 'cherry', 'apple'].sort(byOrder({ order: 'asc' }))).toEqual(['apple', 'banana', 'cherry']);
    });

    it('sorts strings in descending order when order is desc', () => {
      expect(['banana', 'cherry', 'apple'].sort(byOrder({ order: 'desc' }))).toEqual(['cherry', 'banana', 'apple']);
    });

    it('sorts strings in descending order when order is null or undefined', () => {
      expect(['banana', 'cherry', 'apple'].sort(byOrder({ order: null }))).toEqual(['cherry', 'banana', 'apple']);
      expect(['banana', 'cherry', 'apple'].sort(byOrder({ order: undefined }))).toEqual(['cherry', 'banana', 'apple']);
    });

    it('returns a comparator with the expected sign', () => {
      const asc = byOrder({ order: 'asc' });
      expect(asc('a', 'b')).toBeLessThan(0);
      expect(asc('b', 'a')).toBeGreaterThan(0);
      expect(asc('a', 'a')).toBe(0);

      const desc = byOrder({ order: 'desc' });
      expect(desc('a', 'b')).toBeGreaterThan(0);
      expect(desc('b', 'a')).toBeLessThan(0);
      expect(desc('a', 'a')).toBe(0);
    });

    it('keeps an already sorted array untouched', () => {
      expect(['a', 'b', 'c'].sort(byOrder({ order: 'asc' }))).toEqual(['a', 'b', 'c']);
    });
  });
});
