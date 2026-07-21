import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  generateRandomId,
  randFromArray,
  randIntFromInterval,
  random,
  shuffleArray,
  shuffleArrayMutate,
  shuffleString,
} from './random';

describe('random utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('random', () => {
    it('returns a number between 0 (inclusive) and 1 (exclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('delegates to Math.random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.42);
      expect(random()).toBe(0.42);
    });
  });

  describe('randFromArray', () => {
    it('returns an element of the array', () => {
      const array = ['a', 'b', 'c'];
      for (let i = 0; i < 50; i++) {
        expect(array).toContain(randFromArray(array));
      }
    });

    it('picks the element matching the random index', () => {
      const array = ['a', 'b', 'c', 'd'];

      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(randFromArray(array)).toBe('a');

      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      expect(randFromArray(array)).toBe('d');
    });

    it('throws for an empty array', () => {
      expect(() => randFromArray([])).toThrow('Array is empty or index out of bounds');
    });
  });

  describe('randIntFromInterval', () => {
    it('returns integers within [min, max)', () => {
      for (let i = 0; i < 100; i++) {
        const value = randIntFromInterval(5, 10);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThan(10);
      }
    });

    it('maps the random value onto the interval', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(randIntFromInterval(5, 10)).toBe(5);

      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      expect(randIntFromInterval(5, 10)).toBe(9);

      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      expect(randIntFromInterval(0, 100)).toBe(50);
    });
  });

  describe('shuffleArrayMutate', () => {
    it('mutates and returns the same array reference', () => {
      const array = [1, 2, 3, 4];
      const result = shuffleArrayMutate(array);

      expect(result).toBe(array);
    });

    it('keeps the same elements', () => {
      const array = [5, 3, 1, 4, 2];
      const result = shuffleArrayMutate([...array]);

      expect([...result].sort()).toEqual([...array].sort());
    });

    it('shuffles deterministically with a mocked random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(shuffleArrayMutate([1, 2, 3])).toEqual([2, 3, 1]);
    });
  });

  describe('shuffleArray', () => {
    it('does not mutate the original array', () => {
      const array = [1, 2, 3, 4, 5];
      const copy = [...array];

      shuffleArray(array);

      expect(array).toEqual(copy);
    });

    it('returns a new array with the same elements', () => {
      const array = [1, 2, 3, 4, 5];
      const result = shuffleArray(array);

      expect(result).not.toBe(array);
      expect([...result].sort()).toEqual([...array].sort());
    });
  });

  describe('shuffleString', () => {
    it('keeps the same characters', () => {
      const result = shuffleString('abcdef');

      expect(result).toHaveLength(6);
      expect(result.split('').sort().join('')).toBe('abcdef');
    });

    it('shuffles deterministically with a mocked random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(shuffleString('abc')).toBe('bca');
    });

    it('supports a custom delimiter', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(shuffleString('aa-bb-cc', '-')).toBe('bb-cc-aa');
    });
  });

  describe('generateRandomId', () => {
    it('returns an id with the expected format', () => {
      expect(generateRandomId()).toMatch(/^id-[0-9a-z]{1,10}$/);
    });

    it('derives the id from the random value', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      expect(generateRandomId()).toBe(`id-${(0.5).toString(36).substring(2, 12)}`);
    });
  });
});
