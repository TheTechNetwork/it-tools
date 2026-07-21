import { describe, expect, it } from 'vitest';
import { convertTomlToJson, isValidToml } from './toml-to-json.service';

describe('toml-to-json service', () => {
  describe('convertTomlToJson', () => {
    it('converts flat TOML key-values to a JSON string', () => {
      expect(convertTomlToJson('name = "it-tools"\ncount = 42\nenabled = true')).toBe(
        JSON.stringify({ name: 'it-tools', count: 42, enabled: true }, null, 3),
      );
    });

    it('converts TOML tables to nested objects', () => {
      expect(convertTomlToJson('[server]\nhost = "localhost"\nport = 8080')).toBe(
        JSON.stringify({ server: { host: 'localhost', port: 8080 } }, null, 3),
      );
    });

    it('converts TOML arrays', () => {
      expect(convertTomlToJson('tags = ["a", "b", "c"]')).toBe(JSON.stringify({ tags: ['a', 'b', 'c'] }, null, 3));
    });

    it('converts TOML array of tables', () => {
      expect(convertTomlToJson('[[items]]\nid = 1\n\n[[items]]\nid = 2')).toBe(
        JSON.stringify({ items: [{ id: 1 }, { id: 2 }] }, null, 3),
      );
    });

    it('handles special characters in strings', () => {
      expect(convertTomlToJson('a = "with \\"quotes\\" and \\n newline"')).toBe(
        JSON.stringify({ a: 'with "quotes" and \n newline' }, null, 3),
      );
    });

    it('converts an empty string to an empty JSON object', () => {
      expect(convertTomlToJson('')).toBe('{}');
    });

    it('throws on invalid TOML', () => {
      expect(() => convertTomlToJson('not valid toml')).toThrow();
      expect(() => convertTomlToJson('a = ')).toThrow();
    });
  });

  describe('isValidToml', () => {
    it('returns true for valid TOML', () => {
      expect(isValidToml('key = "value"')).toBe(true);
      expect(isValidToml('[table]\nkey = 1')).toBe(true);
      expect(isValidToml('')).toBe(true);
    });

    it('returns false for invalid TOML', () => {
      expect(isValidToml('not valid toml')).toBe(false);
      expect(isValidToml('a = ')).toBe(false);
      expect(isValidToml('{"json": "not toml"}')).toBe(false);
    });
  });
});
