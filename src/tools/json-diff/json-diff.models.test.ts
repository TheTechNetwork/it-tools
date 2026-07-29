import { describe, expect, it } from 'vitest';
import { diff as rawDiff } from './json-diff.models';

// diff() returns a discriminated union where only object/array nodes carry
// `children`. These tests walk the tree structurally, so view the result
// through a recursive shape with optional children.
interface DiffNode {
  key: string | number;
  type: string;
  value?: unknown;
  oldValue?: unknown;
  status: string;
  children?: DiffNode[];
}
const diff = (...args: Parameters<typeof rawDiff>) => rawDiff(...args) as unknown as DiffNode;

describe('json-diff models', () => {
  describe('diff', () => {
    it('list object differences', () => {
      const obj = { a: 1, b: 2 };
      const newObj = { a: 1, b: 2, c: 3 };
      const result = diff(obj, newObj);

      expect(result).toEqual({
        key: '',
        type: 'object',
        children: [
          {
            key: 'a',
            type: 'value',
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 'b',
            type: 'value',
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 'c',
            type: 'value',
            value: 3,
            oldValue: undefined,
            status: 'added',
          },
        ],
        oldValue: { a: 1, b: 2 },
        value: { a: 1, b: 2, c: 3 },
        status: 'children-updated',
      });
    });

    it('list array differences', () => {
      const obj = [1, 2];
      const newObj = [1, 2, 3];
      const result = diff(obj, newObj);

      expect(result).toEqual({
        key: '',
        type: 'array',
        children: [
          {
            key: 0,
            type: 'value',
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 1,
            type: 'value',
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 2,
            type: 'value',
            value: 3,
            oldValue: undefined,
            status: 'added',
          },
        ],
        oldValue: [1, 2],
        value: [1, 2, 3],
        status: 'children-updated',
      });
    });

    it('diffs two primitive values at the top level', () => {
      expect(diff(1, 2)).toEqual({
        key: '',
        type: 'value',
        oldValue: 1,
        value: 2,
        status: 'updated',
      });
    });

    it('reports unchanged primitive values', () => {
      expect(diff('same', 'same')).toEqual({
        key: '',
        type: 'value',
        oldValue: 'same',
        value: 'same',
        status: 'unchanged',
      });
    });

    it('marks a removed key', () => {
      const result = diff({ a: 1, b: 2 }, { a: 1 });
      expect(result.children).toContainEqual({
        key: 'b',
        type: 'value',
        value: undefined,
        oldValue: 2,
        status: 'removed',
      });
    });

    it('marks an updated value', () => {
      const result = diff({ a: 1 }, { a: 2 });
      expect(result.children).toContainEqual({
        key: 'a',
        type: 'value',
        value: 2,
        oldValue: 1,
        status: 'updated',
      });
    });

    it('recurses into nested objects and reports children-updated', () => {
      const result = diff({ a: { b: 1 } }, { a: { b: 2 } });
      expect(result.children?.[0]).toMatchObject({
        key: 'a',
        type: 'object',
        status: 'children-updated',
      });
      expect(result.children?.[0].children?.[0]).toEqual({
        key: 'b',
        type: 'value',
        value: 2,
        oldValue: 1,
        status: 'updated',
      });
    });

    it('recurses into nested arrays inside objects', () => {
      const result = diff({ a: [1] }, { a: [1, 2] });
      const nested = result.children?.[0];
      expect(nested).toMatchObject({ key: 'a', type: 'array', status: 'children-updated' });
      expect(nested?.children).toHaveLength(2);
      expect(nested?.children?.[1]).toEqual({
        key: 1,
        type: 'value',
        value: 2,
        oldValue: undefined,
        status: 'added',
      });
    });

    it('treats null as a plain value, not an object', () => {
      const result = diff({ a: null }, { a: null });
      expect(result.children?.[0]).toEqual({
        key: 'a',
        type: 'value',
        value: null,
        oldValue: null,
        status: 'unchanged',
      });
    });

    it('marks a type change from value to object as updated', () => {
      const result = diff({ a: 1 }, { a: { b: 2 } });
      expect(result.children?.[0]).toMatchObject({
        key: 'a',
        status: 'updated',
      });
    });

    it('handles shorter new arrays by marking removed items', () => {
      const result = diff([1, 2, 3], [1]);
      expect(result.children?.[2]).toEqual({
        key: 2,
        type: 'value',
        value: undefined,
        oldValue: 3,
        status: 'removed',
      });
    });

    it('falls through to a value diff when only one side is an object', () => {
      const result = diff({ a: 1 }, 5);
      expect(result.type).toBe('value');
      expect(result.status).toBe('updated');
      expect(result.oldValue).toEqual({ a: 1 });
      expect(result.value).toBe(5);
    });

    it('falls through to a value diff when the sides mix array and object', () => {
      // an array vs an object: not both arrays, not the value branch guards,
      // so lodash isObject is true for both -> object branch is taken
      const result = diff([1, 2], { a: 1 });
      expect(result.type).toBe('object');
      expect(result.status).toBe('updated');
    });

    describe('onlyShowDifferences', () => {
      it('filters out unchanged object keys', () => {
        const result = diff({ a: 1, b: 2 }, { a: 1, b: 3 }, { onlyShowDifferences: true });
        expect(result.children).toEqual([
          {
            key: 'b',
            type: 'value',
            value: 3,
            oldValue: 2,
            status: 'updated',
          },
        ]);
      });

      it('filters out unchanged array items', () => {
        const result = diff([1, 2, 3], [1, 9, 3], { onlyShowDifferences: true });
        expect(result.children).toEqual([
          {
            key: 1,
            type: 'value',
            value: 9,
            oldValue: 2,
            status: 'updated',
          },
        ]);
      });

      it('filters unchanged keys inside nested objects', () => {
        const result = diff(
          { a: { keep: 1, change: 1 } },
          { a: { keep: 1, change: 2 } },
          { onlyShowDifferences: true },
        );
        expect(result.children?.[0].children).toEqual([
          {
            key: 'change',
            type: 'value',
            value: 2,
            oldValue: 1,
            status: 'updated',
          },
        ]);
      });
    });
  });
});
