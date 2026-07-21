import { describe, expect, it } from 'vitest';
import { convertYamlToToml } from './yaml-to-toml.service';

describe('yaml-to-toml service', () => {
  describe('convertYamlToToml', () => {
    it('converts flat YAML to TOML', () => {
      expect(convertYamlToToml('name: it-tools\ncount: 42\nenabled: true')).toBe(
        'name = "it-tools"\ncount = 42\nenabled = true',
      );
    });

    it('converts nested YAML to TOML tables', () => {
      expect(convertYamlToToml('server:\n  host: localhost\n  port: 8080')).toBe(
        '[server]\nhost = "localhost"\nport = 8_080',
      );
    });

    it('converts YAML sequences to TOML arrays', () => {
      expect(convertYamlToToml('tags:\n  - a\n  - b')).toBe('tags = [ "a", "b" ]');
    });

    it('converts sequences of maps to TOML array of tables', () => {
      expect(convertYamlToToml('items:\n  - id: 1\n  - id: 2')).toBe('[[items]]\nid = 1\n\n[[items]]\nid = 2');
    });

    it('uses literal strings for values containing double quotes', () => {
      expect(convertYamlToToml('a: "with \\"quotes\\""')).toBe('a = \'with "quotes"\'');
    });

    it('converts an empty YAML object to an empty string', () => {
      expect(convertYamlToToml('{}')).toBe('');
    });

    it('throws on an empty string (parses to null, which is not a TOML table)', () => {
      expect(() => convertYamlToToml('')).toThrow();
    });

    it('throws when the root is not a map', () => {
      expect(() => convertYamlToToml('- 1\n- 2')).toThrow();
    });

    it('throws on invalid YAML', () => {
      expect(() => convertYamlToToml('foo: bar\n- invalid')).toThrow();
    });
  });
});
