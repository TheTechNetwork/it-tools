import { describe, expect, it } from 'vitest';
import { convertXmlToJson } from './xml-to-json.service';

describe('xml-to-json service', () => {
  describe('convertXmlToJson', () => {
    it('converts a self-closing element with attributes', () => {
      expect(convertXmlToJson('<a x="1.234" y="It\'s"/>')).toBe(
        JSON.stringify({ a: { _attributes: { x: '1.234', y: 'It\'s' } } }, null, 2),
      );
    });

    it('converts elements with text content', () => {
      expect(convertXmlToJson('<greeting>hello world</greeting>')).toBe(
        JSON.stringify({ greeting: { _text: 'hello world' } }, null, 2),
      );
    });

    it('converts nested elements', () => {
      expect(convertXmlToJson('<root><child><grandchild>value</grandchild></child></root>')).toBe(
        JSON.stringify({ root: { child: { grandchild: { _text: 'value' } } } }, null, 2),
      );
    });

    it('converts repeated elements to arrays', () => {
      expect(convertXmlToJson('<root><item>a</item><item>b</item></root>')).toBe(
        JSON.stringify({ root: { item: [{ _text: 'a' }, { _text: 'b' }] } }, null, 2),
      );
    });

    it('converts the XML declaration', () => {
      expect(convertXmlToJson('<?xml version="1.0" encoding="utf-8"?><a>b</a>')).toBe(
        JSON.stringify({ _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } }, a: { _text: 'b' } }, null, 2),
      );
    });

    it('converts CDATA sections', () => {
      expect(convertXmlToJson('<a><![CDATA[<markup/>]]></a>')).toBe(
        JSON.stringify({ a: { _cdata: '<markup/>' } }, null, 2),
      );
    });

    it('converts an empty string to an empty JSON object', () => {
      expect(convertXmlToJson('')).toBe('{}');
    });

    it('throws on invalid XML', () => {
      expect(() => convertXmlToJson('<a><b></a>')).toThrow();
      expect(() => convertXmlToJson('plain text')).toThrow();
    });
  });
});
