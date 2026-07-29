import type { ConvertOptions } from './list-converter.types';
import { describe, expect, it } from 'vitest';
import { convert } from './list-converter.models';

describe('list-converter', () => {
  describe('convert', () => {
    it('should convert a given list', () => {
      const options: ConvertOptions = {
        separator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '"',
        itemSuffix: '"',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      const input = `
        1
        2
        
        3
        3
        4
        `;
      expect(convert(input, options)).toEqual('"1", "2", "3", "4"');
    });

    it('should return an empty value for an empty input', () => {
      const options: ConvertOptions = {
        separator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '',
        itemSuffix: '',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      expect(convert('', options)).toEqual('');
    });

    it('should keep line breaks', () => {
      const options: ConvertOptions = {
        separator: '',
        trimItems: true,
        itemPrefix: '<li>',
        itemSuffix: '</li>',
        listPrefix: '<ul>',
        listSuffix: '</ul>',
        keepLineBreaks: true,
        lowerCase: false,
        removeDuplicates: false,
        reverseList: false,
        sortList: null,
      };
      const input = `
        1
        2
        3
        `;
      const expected = `<ul>
<li>1</li>
<li>2</li>
<li>3</li>
</ul>`;
      expect(convert(input, options)).toEqual(expected);
    });

    const baseOptions: ConvertOptions = {
      separator: ', ',
      trimItems: false,
      removeDuplicates: false,
      itemPrefix: '',
      itemSuffix: '',
      listPrefix: '',
      listSuffix: '',
      reverseList: false,
      sortList: null,
      lowerCase: false,
      keepLineBreaks: false,
    };

    it('lowercases every item when lowerCase is enabled', () => {
      expect(convert('Foo\nBAR', { ...baseOptions, lowerCase: true })).toEqual('foo, bar');
    });

    it('leaves the case untouched when lowerCase is disabled', () => {
      expect(convert('Foo\nBAR', { ...baseOptions, lowerCase: false })).toEqual('Foo, BAR');
    });

    it('reverses the list when reverseList is enabled', () => {
      expect(convert('a\nb\nc', { ...baseOptions, reverseList: true })).toEqual('c, b, a');
    });

    it('sorts the list ascending', () => {
      expect(convert('c\na\nb', { ...baseOptions, sortList: 'asc' })).toEqual('a, b, c');
    });

    it('sorts the list descending', () => {
      expect(convert('a\nc\nb', { ...baseOptions, sortList: 'desc' })).toEqual('c, b, a');
    });

    it('trims each item when trimItems is enabled', () => {
      expect(convert('  a  \n  b  ', { ...baseOptions, trimItems: true })).toEqual('a, b');
    });

    it('keeps untrimmed items when trimItems is disabled', () => {
      expect(convert('a\nb', { ...baseOptions, trimItems: false })).toEqual('a, b');
    });

    it('wraps items and the list with prefixes and suffixes without line breaks', () => {
      expect(
        convert('a\nb', {
          ...baseOptions,
          itemPrefix: '[',
          itemSuffix: ']',
          listPrefix: '<',
          listSuffix: '>',
        }),
      ).toEqual('<[a], [b]>');
    });
  });
});
