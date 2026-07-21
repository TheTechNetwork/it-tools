import { describe, expect, it } from 'vitest';
import { convertJsonToToml } from './json-to-toml.service';

describe('json-to-toml service', () => {
  describe('convertJsonToToml', () => {
    it('converts a flat JSON object to TOML', () => {
      expect(convertJsonToToml('{"name": "it-tools", "count": 42, "enabled": true}')).toBe(
        'name = "it-tools"\ncount = 42\nenabled = true',
      );
    });

    it('converts nested objects to TOML tables', () => {
      expect(convertJsonToToml('{"server": {"host": "localhost", "port": 8080}}')).toBe(
        '[server]\nhost = "localhost"\nport = 8_080',
      );
    });

    it('converts arrays to TOML arrays', () => {
      expect(convertJsonToToml('{"tags": ["a", "b", "c"]}')).toBe('tags = [ "a", "b", "c" ]');
    });

    it('converts arrays of objects to TOML array of tables', () => {
      expect(convertJsonToToml('{"items": [{"id": 1}, {"id": 2}]}')).toBe(
        '[[items]]\nid = 1\n\n[[items]]\nid = 2',
      );
    });

    it('supports JSON5 syntax (unquoted keys, single quotes)', () => {
      expect(convertJsonToToml('{ key: \'value\' }')).toBe('key = "value"');
    });

    it('uses literal strings for values containing double quotes', () => {
      expect(convertJsonToToml('{"a": "with \\"quotes\\""}')).toBe('a = \'with "quotes"\'');
    });

    it('uses multiline strings for values containing newlines', () => {
      expect(convertJsonToToml('{"a": "line1\\nline2"}')).toBe('a = """\nline1\nline2"""');
    });

    it('converts an empty object to an empty string', () => {
      expect(convertJsonToToml('{}')).toBe('');
    });

    it('throws on an empty string', () => {
      expect(() => convertJsonToToml('')).toThrow();
    });

    it('throws on invalid JSON', () => {
      expect(() => convertJsonToToml('{"a":')).toThrow();
    });

    it('throws when the root is not an object', () => {
      expect(() => convertJsonToToml('[1, 2, 3]')).toThrow();
    });
  });
});
