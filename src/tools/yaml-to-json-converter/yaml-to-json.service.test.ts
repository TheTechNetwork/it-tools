import { describe, expect, it } from 'vitest';
import { convertYamlToJson } from './yaml-to-json.service';

describe('yaml-to-json service', () => {
  describe('convertYamlToJson', () => {
    it('converts flat YAML to a JSON string', () => {
      expect(convertYamlToJson('name: it-tools\ncount: 42\nenabled: true')).toBe(
        JSON.stringify({ name: 'it-tools', count: 42, enabled: true }, null, 3),
      );
    });

    it('converts nested YAML to nested objects', () => {
      expect(convertYamlToJson('server:\n  host: localhost\n  port: 8080')).toBe(
        JSON.stringify({ server: { host: 'localhost', port: 8080 } }, null, 3),
      );
    });

    it('converts YAML sequences to arrays', () => {
      expect(convertYamlToJson('tags:\n  - a\n  - b')).toBe(JSON.stringify({ tags: ['a', 'b'] }, null, 3));
    });

    it('converts a root sequence', () => {
      expect(convertYamlToJson('- 1\n- 2\n- 3')).toBe(JSON.stringify([1, 2, 3], null, 3));
    });

    it('supports YAML merge keys', () => {
      const yaml = 'base: &base\n  a: 1\nchild:\n  <<: *base\n  b: 2';
      expect(convertYamlToJson(yaml)).toBe(JSON.stringify({ base: { a: 1 }, child: { a: 1, b: 2 } }, null, 3));
    });

    it('handles special characters in strings', () => {
      expect(convertYamlToJson('a: "with \\"quotes\\""')).toBe(JSON.stringify({ a: 'with "quotes"' }, null, 3));
    });

    it('returns an empty string for an empty input', () => {
      expect(convertYamlToJson('')).toBe('');
    });

    it('returns an empty string when the yaml parses to a falsy value', () => {
      expect(convertYamlToJson('null')).toBe('');
    });

    it('throws on invalid YAML', () => {
      expect(() => convertYamlToJson('foo: bar\n- invalid')).toThrow();
    });
  });
});
