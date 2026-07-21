import { describe, expect, it } from 'vitest';
import { convertJsonToYaml } from './json-to-yaml.service';

describe('json-to-yaml service', () => {
  describe('convertJsonToYaml', () => {
    it('converts a flat JSON object to YAML', () => {
      expect(convertJsonToYaml('{"name": "it-tools", "count": 42, "enabled": true}')).toBe(
        'name: it-tools\ncount: 42\nenabled: true\n',
      );
    });

    it('converts nested objects to indented YAML', () => {
      expect(convertJsonToYaml('{"server": {"host": "localhost", "port": 8080}}')).toBe(
        'server:\n  host: localhost\n  port: 8080\n',
      );
    });

    it('converts arrays to YAML sequences', () => {
      expect(convertJsonToYaml('{"tags": ["a", "b"]}')).toBe('tags:\n  - a\n  - b\n');
    });

    it('converts a root array', () => {
      expect(convertJsonToYaml('[1, 2, 3]')).toBe('- 1\n- 2\n- 3\n');
    });

    it('handles null values', () => {
      expect(convertJsonToYaml('{"a": null}')).toBe('a: null\n');
    });

    it('supports JSON5 syntax (unquoted keys, single quotes, trailing commas)', () => {
      expect(convertJsonToYaml('{ a: 1, b: \'two\', }')).toBe('a: 1\nb: two\n');
    });

    it('quotes strings that would otherwise be interpreted as other YAML types', () => {
      expect(convertJsonToYaml('{"a": "true", "b": "123"}')).toBe('a: "true"\nb: "123"\n');
    });

    it('throws on an empty string', () => {
      expect(() => convertJsonToYaml('')).toThrow();
    });

    it('throws on invalid JSON', () => {
      expect(() => convertJsonToYaml('{"a":')).toThrow();
    });
  });
});
