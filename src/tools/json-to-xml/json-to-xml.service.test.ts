import { describe, expect, it } from 'vitest';
import { convertJsonToXml } from './json-to-xml.service';

describe('json-to-xml service', () => {
  describe('convertJsonToXml', () => {
    it('converts a compact JSON object with attributes to XML', () => {
      expect(convertJsonToXml('{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}')).toBe('<a x="1.234" y="It\'s"/>');
    });

    it('converts elements with text content', () => {
      expect(convertJsonToXml('{"greeting":{"_text":"hello world"}}')).toBe('<greeting>hello world</greeting>');
    });

    it('converts nested elements', () => {
      expect(convertJsonToXml('{"root":{"child":{"grandchild":{"_text":"value"}}}}')).toBe(
        '<root><child><grandchild>value</grandchild></child></root>',
      );
    });

    it('converts arrays to repeated elements', () => {
      expect(convertJsonToXml('{"root":{"item":[{"_text":"a"},{"_text":"b"}]}}')).toBe(
        '<root><item>a</item><item>b</item></root>',
      );
    });

    it('supports a declaration element', () => {
      expect(convertJsonToXml('{"_declaration":{"_attributes":{"version":"1.0"}},"a":{"_text":"b"}}')).toBe(
        '<?xml version="1.0"?><a>b</a>',
      );
    });

    it('supports JSON5 syntax (unquoted keys, single quotes)', () => {
      expect(convertJsonToXml('{ a: { _text: \'b\' } }')).toBe('<a>b</a>');
    });

    it('converts an empty object to an empty string', () => {
      expect(convertJsonToXml('{}')).toBe('');
    });

    it('throws on an empty string', () => {
      expect(() => convertJsonToXml('')).toThrow();
    });

    it('throws on invalid JSON', () => {
      expect(() => convertJsonToXml('{"a":')).toThrow();
    });
  });
});
