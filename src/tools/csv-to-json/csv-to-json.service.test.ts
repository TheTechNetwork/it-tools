import { describe, expect, it } from 'vitest';
import { convertCsvToJson, parseCsv } from './csv-to-json.service';

describe('csv-to-json', () => {
  describe('parseCsv', () => {
    it('parses simple rows', () => {
      expect(parseCsv('a,b,c\n1,2,3')).toEqual([['a', 'b', 'c'], ['1', '2', '3']]);
    });

    it('handles quoted fields containing the delimiter', () => {
      expect(parseCsv('name,note\n"Doe, John","hi"')).toEqual([
        ['name', 'note'],
        ['Doe, John', 'hi'],
      ]);
    });

    it('handles escaped quotes inside quoted fields', () => {
      expect(parseCsv('a\n"say ""hi"""')).toEqual([['a'], ['say "hi"']]);
    });

    it('handles newlines inside quoted fields', () => {
      expect(parseCsv('a,b\n"line1\nline2",x')).toEqual([
        ['a', 'b'],
        ['line1\nline2', 'x'],
      ]);
    });

    it('handles Windows CRLF line endings', () => {
      expect(parseCsv('a,b\r\n1,2\r\n3,4')).toEqual([['a', 'b'], ['1', '2'], ['3', '4']]);
    });

    it('supports a custom delimiter', () => {
      expect(parseCsv('a;b\n1;2', { delimiter: ';' })).toEqual([['a', 'b'], ['1', '2']]);
    });
  });

  describe('convertCsvToJson', () => {
    it('converts CSV to an array of objects using the header row', () => {
      const json = convertCsvToJson('name,age\nAlice,30\nBob,25');

      expect(JSON.parse(json)).toEqual([
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '25' },
      ]);
    });

    it('fills missing trailing cells with empty strings', () => {
      const json = convertCsvToJson('a,b,c\n1,2');

      expect(JSON.parse(json)).toEqual([{ a: '1', b: '2', c: '' }]);
    });

    it('returns an array of arrays when header is disabled', () => {
      const json = convertCsvToJson('1,2\n3,4', { header: false });

      expect(JSON.parse(json)).toEqual([['1', '2'], ['3', '4']]);
    });

    it('returns an empty array for empty input', () => {
      expect(convertCsvToJson('')).toBe('[]');
    });
  });
});
