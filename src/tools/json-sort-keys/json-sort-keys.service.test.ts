import { describe, expect, it } from 'vitest';
import { sortJsonKeys } from './json-sort-keys.service';

describe('json-sort-keys', () => {
  it('sorts top-level keys alphabetically', () => {
    expect(sortJsonKeys('{"b":1,"a":2,"c":3}')).toBe('{\n  "a": 2,\n  "b": 1,\n  "c": 3\n}');
  });

  it('sorts nested object keys recursively', () => {
    const result = sortJsonKeys('{"z":{"b":1,"a":2}}');
    expect(JSON.parse(result)).toEqual({ z: { a: 2, b: 1 } });
    expect(result.indexOf('"a"')).toBeLessThan(result.indexOf('"b"'));
  });

  it('preserves array order but sorts keys within array elements', () => {
    const result = sortJsonKeys('[{"b":1,"a":2},{"d":3,"c":4}]');
    expect(result).toBe('[\n  {\n    "a": 2,\n    "b": 1\n  },\n  {\n    "c": 4,\n    "d": 3\n  }\n]');
  });

  it('supports descending order', () => {
    expect(sortJsonKeys('{"a":1,"b":2}', { order: 'desc' })).toBe('{\n  "b": 2,\n  "a": 1\n}');
  });

  it('respects a custom indent', () => {
    expect(sortJsonKeys('{"b":1,"a":2}', { indent: 4 })).toBe('{\n    "a": 2,\n    "b": 1\n}');
  });

  it('tolerates JSON5 input', () => {
    const result = sortJsonKeys('{ b: 1, a: 2, /* comment */ }');
    expect(JSON.parse(result)).toEqual({ a: 2, b: 1 });
  });

  it('handles primitives and null', () => {
    expect(sortJsonKeys('42')).toBe('42');
    expect(sortJsonKeys('null')).toBe('null');
    expect(sortJsonKeys('"text"')).toBe('"text"');
  });

  it('throws on invalid JSON', () => {
    expect(() => sortJsonKeys('not json')).toThrow();
  });
});
