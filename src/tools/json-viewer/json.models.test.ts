import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { formatJson, sortObjectKeys } from './json.models';

describe('json models', () => {
  describe('sortObjectKeys', () => {
    it('the object keys are recursively sorted alphabetically', () => {
      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1 }))).toEqual(JSON.stringify({ a: 1, b: 2 }));
      // To unsure that this way of testing is working
      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1 }))).not.toEqual(JSON.stringify({ b: 2, a: 1 }));

      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1, d: { j: 7, a: [{ z: 9, y: 8 }] }, c: 3 }))).toEqual(
        JSON.stringify({ a: 1, b: 2, c: 3, d: { a: [{ y: 8, z: 9 }], j: 7 } }),
      );
    });

    it('returns primitive values as-is', () => {
      expect(sortObjectKeys(1)).toBe(1);
      expect(sortObjectKeys('hello')).toBe('hello');
      expect(sortObjectKeys(true)).toBe(true);
    });

    it('returns null as-is', () => {
      expect(sortObjectKeys(null)).toBeNull();
    });

    it('sorts nested null values without throwing', () => {
      expect(JSON.stringify(sortObjectKeys({ b: null, a: 1 }))).toEqual(JSON.stringify({ a: 1, b: null }));
    });

    it('sorts arrays of primitives element-wise', () => {
      expect(sortObjectKeys([3, 1, 2])).toEqual([3, 1, 2]);
    });
  });

  describe('formatJson', () => {
    it('formats and sorts keys by default with a 3-space indent', () => {
      expect(formatJson({ rawJson: '{"b":2,"a":1}' })).toEqual('{\n   "a": 1,\n   "b": 2\n}');
    });

    it('preserves key order when sortKeys is false', () => {
      expect(formatJson({ rawJson: '{"b":2,"a":1}', sortKeys: false })).toEqual('{\n   "b": 2,\n   "a": 1\n}');
    });

    it('honours a custom indent size', () => {
      expect(formatJson({ rawJson: '{"a":1}', indentSize: 2 })).toEqual('{\n  "a": 1\n}');
    });

    it('accepts refs for every option (MaybeRef)', () => {
      expect(
        formatJson({
          rawJson: ref('{"b":2,"a":1}'),
          sortKeys: ref(true),
          indentSize: ref(4),
        }),
      ).toEqual('{\n    "a": 1,\n    "b": 2\n}');
    });

    it('parses lenient JSON5 input (comments, unquoted keys, trailing commas)', () => {
      const json5Input = `{
        // a comment
        b: 2,
        a: 1,
      }`;
      expect(formatJson({ rawJson: json5Input })).toEqual('{\n   "a": 1,\n   "b": 2\n}');
    });

    it('throws on invalid JSON', () => {
      expect(() => formatJson({ rawJson: '{invalid' })).toThrow();
    });
  });
});
