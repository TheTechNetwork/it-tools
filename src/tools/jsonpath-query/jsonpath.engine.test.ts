import { describe, expect, it } from 'vitest';
import { evaluateJsonPath } from './jsonpath.engine';

const store = {
  store: {
    books: [
      { title: 'Book A', price: 10, tags: ['x', 'y'] },
      { title: 'Book B', price: 25, tags: ['z'] },
      { title: 'Book C', price: 5 },
    ],
    bicycle: { color: 'red', price: 100 },
  },
  version: 2,
};

function run(path: string, json: unknown = store) {
  return evaluateJsonPath({ path, json });
}

describe('jsonpath.engine', () => {
  describe('member access', () => {
    it('returns the root for $ or empty path', () => {
      expect(run('$')).toEqual([store]);
      expect(run('')).toEqual([store]);
    });

    it('reads nested members via dot and bracket notation', () => {
      expect(run('$.version')).toEqual([2]);
      expect(run('$.store.bicycle.color')).toEqual(['red']);
      expect(run('$[\'store\'][\'bicycle\'][\'color\']')).toEqual(['red']);
    });

    it('supports a leading bare name (no leading dot)', () => {
      expect(run('version')).toEqual([2]);
    });

    it('returns nothing for missing members', () => {
      expect(run('$.store.missing')).toEqual([]);
      expect(run('$.nope.deeper')).toEqual([]);
    });
  });

  describe('wildcards', () => {
    it('expands all object values', () => {
      expect(run('$.store.bicycle.*')).toEqual(['red', 100]);
    });

    it('expands all array elements', () => {
      expect(run('$.store.books[*].title')).toEqual(['Book A', 'Book B', 'Book C']);
      expect(run('$.store.books.*.price')).toEqual([10, 25, 5]);
    });
  });

  describe('indices and slices', () => {
    it('reads by positive and negative index', () => {
      expect(run('$.store.books[0].title')).toEqual(['Book A']);
      expect(run('$.store.books[-1].title')).toEqual(['Book C']);
      expect(run('$.store.books[10]')).toEqual([]);
    });

    it('slices with start/end/step', () => {
      expect(run('$.store.books[0:2].title')).toEqual(['Book A', 'Book B']);
      expect(run('$.store.books[:2].title')).toEqual(['Book A', 'Book B']);
      expect(run('$.store.books[1:].title')).toEqual(['Book B', 'Book C']);
      expect(run('$.store.books[::2].title')).toEqual(['Book A', 'Book C']);
      expect(run('$.store.books[-2:].title')).toEqual(['Book B', 'Book C']);
    });

    it('slices with a negative step', () => {
      expect(run('$.store.books[::-1].title')).toEqual(['Book C', 'Book B', 'Book A']);
    });

    it('returns nothing for a zero step', () => {
      expect(run('$.store.books[::0]')).toEqual([]);
    });
  });

  describe('unions', () => {
    it('unions member names', () => {
      expect(run('$.store.bicycle[\'color\',\'price\']')).toEqual(['red', 100]);
    });

    it('unions array indices', () => {
      expect(run('$.store.books[0,2].title')).toEqual(['Book A', 'Book C']);
    });
  });

  describe('recursive descent', () => {
    it('finds a member at any depth', () => {
      expect(run('$..price')).toEqual([10, 25, 5, 100]);
    });

    it('supports recursive wildcard and brackets', () => {
      expect(run('$..books[*].title')).toEqual(['Book A', 'Book B', 'Book C']);
      expect(run('$..[\'color\']')).toEqual(['red']);
    });
  });

  describe('filters', () => {
    it('filters by numeric comparison', () => {
      expect(run('$.store.books[?(@.price > 20)].title')).toEqual(['Book B']);
      expect(run('$.store.books[?(@.price >= 10)].title')).toEqual(['Book A', 'Book B']);
      expect(run('$.store.books[?(@.price < 10)].title')).toEqual(['Book C']);
    });

    it('filters by equality and inequality', () => {
      expect(run('$.store.books[?(@.title == \'Book A\')].price')).toEqual([10]);
      expect(run('$.store.books[?(@.price != 10)].title')).toEqual(['Book B', 'Book C']);
    });

    it('supports boolean operators and parentheses', () => {
      expect(run('$.store.books[?(@.price > 5 && @.price < 25)].title')).toEqual(['Book A']);
      expect(run('$.store.books[?(@.price < 10 || @.price > 20)].title')).toEqual(['Book B', 'Book C']);
      expect(run('$.store.books[?((@.price > 5) && (@.title != \'Book B\'))].title')).toEqual(['Book A']);
    });

    it('supports existence tests and negation', () => {
      expect(run('$.store.books[?(@.tags)].title')).toEqual(['Book A', 'Book B']);
      expect(run('$.store.books[?(!@.tags)].title')).toEqual(['Book C']);
    });

    it('supports a bare-word existence path', () => {
      expect(run('$.store.books[?(tags)].title')).toEqual(['Book A', 'Book B']);
    });

    it('can reference the root document', () => {
      // $.version is 2, so every book price (>= 5) is greater than it.
      expect(run('$.store.books[?(@.price > $.version)].title').length).toBe(3);
    });

    it('filters object values', () => {
      const data = { a: { n: 1 }, b: { n: 5 } };
      expect(run('$[?(@.n > 3)].n', data)).toEqual([5]);
    });

    it('handles boolean and null literals', () => {
      const data = [{ ok: true, v: null }, { ok: false, v: 1 }];
      expect(run('$[?(@.ok == true)].v', data)).toEqual([null]);
      expect(run('$[?(@.v == null)].ok', data)).toEqual([true]);
    });
  });

  describe('bracket name variants', () => {
    it('reads bare and double-quoted bracket names', () => {
      expect(run('$.store[bicycle].color')).toEqual(['red']);
      expect(run('$.store["bicycle"]["color"]')).toEqual(['red']);
    });

    it('unions quoted names that contain a comma', () => {
      expect(run('$[\',x\',\'y\']', { ',x': 1, 'y': 2 })).toEqual([1, 2]);
    });
  });

  describe('recursive wildcard', () => {
    it('descends into everything', () => {
      const all = run('$..*');
      expect(all).toContain('red');
      expect(all).toContain(10);
    });
  });

  describe('all comparison operators', () => {
    it('handles === !== <= >=', () => {
      expect(run('$.store.books[?(@.price === 25)].title')).toEqual(['Book B']);
      expect(run('$.store.books[?(@.price !== 10)].title')).toEqual(['Book B', 'Book C']);
      expect(run('$.store.books[?(@.price <= 10)].title')).toEqual(['Book A', 'Book C']);
      expect(run('$.store.books[?(@.price >= 25)].title')).toEqual(['Book B']);
    });

    it('parses decimal/exponent number literals', () => {
      expect(run('$.store.books[?(@.price == 2.5e1)].title')).toEqual(['Book B']);
    });

    it('parses double-quoted string literals', () => {
      expect(run('$.store.books[?(@.title == "Book A")].price')).toEqual([10]);
    });

    it('resolves a bare @ to the current item', () => {
      expect(run('$[?(@ == 2)]', [1, 2, 3])).toEqual([2]);
      expect(run('$[?(@ >= 2)]', [1, 2, 3])).toEqual([2, 3]);
    });
  });

  describe('slice edge cases', () => {
    it('walks backwards with an explicit range', () => {
      expect(run('$.store.books[2:0:-1].title')).toEqual(['Book C', 'Book B']);
      expect(run('$.store.books[2:-3:-1].title')).toEqual(['Book C', 'Book B']);
      expect(run('$.store.books[9:0:-1].title')).toEqual(['Book C', 'Book B']);
    });
  });

  describe('selectors that do not apply to the node type', () => {
    it('returns nothing for index/slice/filter on a non-array', () => {
      expect(run('$.store[0]')).toEqual([]);
      expect(run('$.store[0:1]')).toEqual([]);
      expect(run('$.version[?(@ > 0)]')).toEqual([]);
    });
  });

  describe('union edge cases', () => {
    it('skips missing names and out-of-range indices', () => {
      expect(run('$.store.bicycle[\'color\',\'missing\']')).toEqual(['red']);
      expect(run('$.store.books[-1,0].title')).toEqual(['Book C', 'Book A']);
      expect(run('$.store.books[0,10].title')).toEqual(['Book A']);
    });

    it('walks backwards from a negative start', () => {
      expect(run('$.store.books[-1:0:-1].title')).toEqual(['Book C', 'Book B']);
    });
  });

  describe('nested brackets and alternate path forms in filters', () => {
    it('handles a bracketed index inside a filter path', () => {
      expect(run('$.store.books[?(@.tags[0] == "x")].title')).toEqual(['Book A']);
    });

    it('accepts @[\'name\'] and @name path forms', () => {
      expect(run('$.store.books[?(@[\'price\'] > 20)].title')).toEqual(['Book B']);
      expect(run('$.store.books[?(@price > 20)].title')).toEqual(['Book B']);
    });

    it('unescapes quotes inside filter string literals', () => {
      expect(run('$[?(@.v == \'a\\\'b\')]', [{ v: 'a\'b' }, { v: 'c' }])).toEqual([{ v: 'a\'b' }]);
    });
  });

  describe('errors', () => {
    it('throws on unbalanced brackets', () => {
      expect(() => run('$.store.books[0')).toThrow();
    });

    it('throws on unbalanced parentheses in a filter', () => {
      expect(() => run('$.store.books[?((@.price > 1)]')).toThrow();
    });

    it('throws on a leading operator in a filter', () => {
      expect(() => run('$.store.books[?(&& @.price)]')).toThrow();
    });

    it('throws on an unexpected character in a filter', () => {
      expect(() => run('$.store.books[?(%)]')).toThrow();
    });
  });
});
