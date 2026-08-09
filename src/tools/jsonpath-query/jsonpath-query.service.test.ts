import { describe, expect, it } from 'vitest';
import { queryJson } from './jsonpath-query.service';

const sample = JSON.stringify({
  store: {
    books: [
      { title: 'Book A', price: 10 },
      { title: 'Book B', price: 25 },
    ],
  },
});

describe('jsonpath-query', () => {
  describe('queryJson', () => {
    it('returns an empty string for empty input', () => {
      expect(queryJson({ data: '', query: '$' })).toBe('');
      expect(queryJson({ data: '   ', query: '$.a' })).toBe('');
    });

    it('returns the pretty-printed document when the query is empty', () => {
      expect(queryJson({ data: '{"a":1}', query: '' })).toBe('{\n  "a": 1\n}');
      expect(queryJson({ data: '{"a":1}', query: '   ' })).toBe('{\n  "a": 1\n}');
    });

    it('extracts nested values with a JSONPath expression', () => {
      expect(queryJson({ data: sample, query: '$.store.books[*].title' })).toBe(
        JSON.stringify(['Book A', 'Book B'], null, 2),
      );
    });

    it('supports filter expressions', () => {
      expect(queryJson({ data: sample, query: '$.store.books[?(@.price > 20)].title' })).toBe(
        JSON.stringify(['Book B'], null, 2),
      );
    });

    it('returns an empty array when nothing matches', () => {
      expect(queryJson({ data: sample, query: '$.store.missing' })).toBe('[]');
    });

    it('honours the requested indent size', () => {
      expect(queryJson({ data: '{"a":1}', query: '$.a', indentSize: 4 })).toBe('[\n    1\n]');
    });

    it('accepts lenient JSON5 input', () => {
      expect(queryJson({ data: '{ a: 1, b: 2, }', query: '$.b' })).toBe('[\n  2\n]');
    });

    it('throws on invalid JSON', () => {
      expect(() => queryJson({ data: '{ not valid', query: '$' })).toThrow();
    });
  });
});
