import { describe, expect, it } from 'vitest';
import { formatYaml } from './yaml-viewer.service';

describe('yaml-viewer service', () => {
  describe('formatYaml', () => {
    it('prettifies yaml with the default two-space indent', () => {
      expect(formatYaml({ rawYaml: 'foo:   {bar: 1, baz: [2, 3]}' })).toBe(
        'foo:\n  bar: 1\n  baz:\n    - 2\n    - 3\n',
      );
    });

    it('respects a custom indent size', () => {
      expect(formatYaml({ rawYaml: 'foo: {bar: 1}', indentSize: 4 })).toBe('foo:\n    bar: 1\n');
    });

    it('does not sort keys by default', () => {
      expect(formatYaml({ rawYaml: 'b: 2\na: 1' })).toBe('b: 2\na: 1\n');
    });

    it('sorts map keys when sortKeys is true', () => {
      expect(formatYaml({ rawYaml: 'b: 2\na: 1\nc: {z: 1, y: 2}', sortKeys: true })).toBe(
        'a: 1\nb: 2\nc:\n  y: 2\n  z: 1\n',
      );
    });

    it('keeps comments out but preserves values with special characters', () => {
      expect(formatYaml({ rawYaml: 'a: "true"\nb: \'123\'' })).toBe('a: "true"\nb: "123"\n');
    });

    it('formats an empty string as null', () => {
      expect(formatYaml({ rawYaml: '' })).toBe('null\n');
    });

    it('throws on invalid yaml', () => {
      expect(() => formatYaml({ rawYaml: 'foo: bar\n- invalid' })).toThrow();
    });
  });
});
