import type { LineOperations } from './text-line-tools.service';
import { describe, expect, it } from 'vitest';
import { applyLineOperations } from './text-line-tools.service';

const noOps: LineOperations = {
  trim: false,
  removeEmpty: false,
  unique: false,
  sort: 'none',
  reverse: false,
  number: false,
};

describe('text-line-tools', () => {
  describe('applyLineOperations', () => {
    it('returns an empty string unchanged', () => {
      expect(applyLineOperations('', noOps)).toBe('');
    });

    it('does nothing when no operation is enabled', () => {
      expect(applyLineOperations('b\na\nb', noOps)).toBe('b\na\nb');
    });

    it('sorts lines ascending and descending', () => {
      expect(applyLineOperations('banana\napple\ncherry', { ...noOps, sort: 'asc' })).toBe('apple\nbanana\ncherry');
      expect(applyLineOperations('banana\napple\ncherry', { ...noOps, sort: 'desc' })).toBe('cherry\nbanana\napple');
    });

    it('removes duplicate lines while keeping first occurrence', () => {
      expect(applyLineOperations('a\nb\na\nc\nb', { ...noOps, unique: true })).toBe('a\nb\nc');
    });

    it('reverses the order of lines', () => {
      expect(applyLineOperations('1\n2\n3', { ...noOps, reverse: true })).toBe('3\n2\n1');
    });

    it('trims whitespace on each line', () => {
      expect(applyLineOperations('  a  \n\tb\t', { ...noOps, trim: true })).toBe('a\nb');
    });

    it('removes empty lines', () => {
      expect(applyLineOperations('a\n\n\nb\n', { ...noOps, removeEmpty: true })).toBe('a\nb');
    });

    it('numbers lines with right-aligned padding', () => {
      const input = Array.from({ length: 10 }, (_, i) => `line${i + 1}`).join('\n');
      const output = applyLineOperations(input, { ...noOps, number: true });
      expect(output.split('\n')[0]).toBe(' 1. line1');
      expect(output.split('\n')[9]).toBe('10. line10');
    });

    it('applies operations in a sensible order (trim, dedupe, sort, number)', () => {
      const input = '  b \na\n b\n\na';
      const output = applyLineOperations(input, {
        trim: true,
        removeEmpty: true,
        unique: true,
        sort: 'asc',
        reverse: false,
        number: true,
      });
      expect(output).toBe('1. a\n2. b');
    });

    it('produces a stable shuffle for the same input', () => {
      const input = 'a\nb\nc\nd\ne\nf';
      const first = applyLineOperations(input, { ...noOps, sort: 'shuffle' });
      const second = applyLineOperations(input, { ...noOps, sort: 'shuffle' });
      expect(first).toBe(second);
      // A shuffle keeps the same set of lines.
      expect(first.split('\n').sort()).toEqual(input.split('\n').sort());
    });
  });
});
