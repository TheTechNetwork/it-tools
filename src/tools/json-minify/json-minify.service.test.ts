import { describe, expect, it } from 'vitest';
import { minifyJson } from './json-minify.service';

describe('json-minify service', () => {
  describe('minifyJson', () => {
    it('removes whitespace and newlines from a JSON string', () => {
      expect(minifyJson('{\n\t"hello": [\n\t\t"world"\n\t]\n}')).toBe('{"hello":["world"]}');
      expect(minifyJson('{ "a" : 1 , "b" : 2 }')).toBe('{"a":1,"b":2}');
    });

    it('minifies nested objects and arrays', () => {
      expect(minifyJson('{ "a": { "b": { "c": [1, 2, 3] } }, "d": [ { "e": true } ] }')).toBe(
        '{"a":{"b":{"c":[1,2,3]}},"d":[{"e":true}]}',
      );
    });

    it('supports JSON5 syntax (unquoted keys, single quotes, trailing commas)', () => {
      expect(minifyJson('{ a: 1, b: \'two\', c: [3,], }')).toBe('{"a":1,"b":"two","c":[3]}');
    });

    it('minifies primitive values', () => {
      expect(minifyJson('  "hello"  ')).toBe('"hello"');
      expect(minifyJson(' 42 ')).toBe('42');
      expect(minifyJson('null')).toBe('null');
      expect(minifyJson('true')).toBe('true');
    });

    it('preserves special characters in strings', () => {
      expect(minifyJson('{"a": "line1\\nline2", "b": "quote\\"inside", "c": "héllo 🌍"}')).toBe(
        '{"a":"line1\\nline2","b":"quote\\"inside","c":"héllo 🌍"}',
      );
    });

    it('throws on an empty string', () => {
      expect(() => minifyJson('')).toThrow();
    });

    it('throws on invalid JSON', () => {
      expect(() => minifyJson('{"a":')).toThrow();
      expect(() => minifyJson('not json at all }')).toThrow();
    });
  });
});
