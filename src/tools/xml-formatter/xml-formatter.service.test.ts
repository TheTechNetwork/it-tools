import { describe, expect, it } from 'vitest';
import { formatXml, isValidXML } from './xml-formatter.service';

describe('xml-formatter service', () => {
  describe('formatXml', () => {
    it('converts XML into a human readable format', () => {
      const initString = '<hello><world>foo</world><world>bar</world></hello>';

      expect(formatXml(initString)).toMatchInlineSnapshot(`
        "<hello>
            <world>
                foo
            </world>
            <world>
                bar
            </world>
        </hello>"
      `);
    });

    it('trims surrounding whitespace before formatting', () => {
      expect(formatXml('   <a><b>x</b></a>   ')).toEqual(formatXml('<a><b>x</b></a>'));
    });

    it('respects custom formatter options', () => {
      const formatted = formatXml('<a><b>x</b></a>', { indentation: '  ' });

      expect(formatted).toContain('<a>');
      expect(formatted).toContain('  <b>');
      expect(formatted).toContain('x');
    });

    it('returns an empty string if the input is not valid XML', () => {
      expect(formatXml('hello world')).toEqual('');
    });

    it('returns an empty string for empty input', () => {
      expect(formatXml('')).toEqual('');
      expect(formatXml('   ')).toEqual('');
    });
  });

  describe('isValidXML', () => {
    it('returns true for valid XML', () => {
      expect(isValidXML('<hello><world>foo</world></hello>')).toBe(true);
      expect(isValidXML('<a/>')).toBe(true);
    });

    it('treats empty or whitespace-only input as valid', () => {
      expect(isValidXML('')).toBe(true);
      expect(isValidXML('   ')).toBe(true);
      expect(isValidXML('\n\t ')).toBe(true);
    });

    it('returns false for malformed XML', () => {
      expect(isValidXML('hello world')).toBe(false);
      expect(isValidXML('<<>>')).toBe(false);
    });
  });
});
