import { describe, expect, it } from 'vitest';
import { convertTomlToYaml } from './toml-to-yaml.service';

describe('toml-to-yaml service', () => {
  describe('convertTomlToYaml', () => {
    it('converts flat TOML key-values to YAML', () => {
      expect(convertTomlToYaml('name = "it-tools"\ncount = 42\nenabled = true')).toBe(
        'name: it-tools\ncount: 42\nenabled: true\n',
      );
    });

    it('converts TOML tables to nested YAML', () => {
      expect(convertTomlToYaml('[server]\nhost = "localhost"\nport = 8080')).toBe(
        'server:\n  host: localhost\n  port: 8080\n',
      );
    });

    it('converts TOML arrays to YAML sequences', () => {
      expect(convertTomlToYaml('tags = ["a", "b"]')).toBe('tags:\n  - a\n  - b\n');
    });

    it('converts TOML array of tables', () => {
      expect(convertTomlToYaml('[[items]]\nid = 1\n\n[[items]]\nid = 2')).toBe(
        'items:\n  - id: 1\n  - id: 2\n',
      );
    });

    it('quotes YAML-ambiguous strings', () => {
      expect(convertTomlToYaml('a = "true"')).toBe('a: "true"\n');
    });

    it('converts an empty string to an empty YAML object', () => {
      expect(convertTomlToYaml('')).toBe('{}\n');
    });

    it('throws on invalid TOML', () => {
      expect(() => convertTomlToYaml('not valid toml')).toThrow();
      expect(() => convertTomlToYaml('a = ')).toThrow();
    });
  });
});
