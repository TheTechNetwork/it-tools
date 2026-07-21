import { describe, expect, it } from 'vitest';
import { codesByCategories } from './http-status-codes.constants';
import { allHttpStatusCodes, searchHttpStatusCodes } from './http-status-codes.service';

describe('http-status-codes', () => {
  describe('allHttpStatusCodes', () => {
    it('flattens every code of every category', () => {
      const expectedCount = codesByCategories.reduce((sum, { codes }) => sum + codes.length, 0);

      expect(allHttpStatusCodes).toHaveLength(expectedCount);
    });

    it('attaches the category to each code', () => {
      expect(allHttpStatusCodes.every(({ category }) => typeof category === 'string' && category.length > 0)).toBe(true);

      const ok = allHttpStatusCodes.find(({ code }) => code === 200);
      expect(ok).toMatchObject({ code: 200, name: 'OK', category: '2xx success' });
    });

    it('keeps the code details intact', () => {
      const notFound = allHttpStatusCodes.find(({ code }) => code === 404);

      expect(notFound).toBeDefined();
      expect(notFound!.name).toBe('Not Found');
      expect(notFound!.type).toBe('HTTP');
    });
  });

  describe('searchHttpStatusCodes', () => {
    it('finds a status code by its number', () => {
      const results = searchHttpStatusCodes('404');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].code).toBe(404);
    });

    it('finds a status code by its name', () => {
      const results = searchHttpStatusCodes('teapot');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].code).toBe(418);
    });

    it('finds status codes by description terms', () => {
      const results = searchHttpStatusCodes('protocol');

      expect(results.length).toBeGreaterThan(0);
      expect(results.map(({ code }) => code)).toContain(101);
    });

    it('returns results carrying their category', () => {
      const [first] = searchHttpStatusCodes('301');

      expect(first.category).toBeTypeOf('string');
      expect(first.category.length).toBeGreaterThan(0);
    });

    it('returns an empty array when nothing matches', () => {
      expect(searchHttpStatusCodes('zzzzzzzzzzzz')).toEqual([]);
    });
  });
});
