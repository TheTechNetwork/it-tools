import { describe, expect, it } from 'vitest';
import { inspectString } from './unicode-inspector.service';

describe('unicode-inspector', () => {
  it('returns an empty array for empty input', () => {
    expect(inspectString('')).toEqual([]);
  });

  it('describes a basic ASCII character', () => {
    const [info] = inspectString('A');

    expect(info).toMatchObject({
      char: 'A',
      codePoint: 65,
      unicode: 'U+0041',
      decimal: 65,
      htmlEntity: '&#65;',
      utf8: '0x41',
      utf16: '0x0041',
    });
  });

  it('splits multiple characters', () => {
    const result = inspectString('Ab');

    expect(result).toHaveLength(2);
    expect(result[1].unicode).toBe('U+0062');
  });

  it('handles multi-byte UTF-8 characters', () => {
    const [info] = inspectString('é');

    expect(info.codePoint).toBe(0xE9);
    expect(info.unicode).toBe('U+00E9');
    expect(info.utf8).toBe('0xC3 0xA9');
  });

  it('handles astral-plane characters (emoji) as a single code point', () => {
    const result = inspectString('😀');

    expect(result).toHaveLength(1);
    expect(result[0].codePoint).toBe(0x1F600);
    expect(result[0].unicode).toBe('U+1F600');
    // Emoji outside the BMP are two UTF-16 code units (a surrogate pair).
    expect(result[0].utf16.split(' ')).toHaveLength(2);
    expect(result[0].utf8.split(' ')).toHaveLength(4);
  });

  it('names control characters that have dedicated names', () => {
    expect(inspectString(String.fromCharCode(0x0A))[0].name).toBe('LINE FEED (newline)');
    expect(inspectString(String.fromCharCode(0x09))[0].name).toBe('CHARACTER TABULATION (tab)');
    expect(inspectString(String.fromCharCode(0x00))[0].name).toBe('NULL');
    expect(inspectString(String.fromCharCode(0x20))[0].name).toBe('SPACE');
    expect(inspectString(String.fromCharCode(0x7F))[0].name).toBe('DELETE');
    expect(inspectString(String.fromCharCode(0x1B))[0].name).toBe('ESCAPE');
  });

  it('labels unnamed C0 control characters generically', () => {
    // U+0001 is a control character with no dedicated name in the lookup table.
    expect(inspectString(String.fromCharCode(0x01))[0].name).toBe('CONTROL CHARACTER');
    expect(inspectString(String.fromCharCode(0x1F))[0].name).toBe('CONTROL CHARACTER');
  });

  it('labels C1 control characters (U+0080-U+009F) generically', () => {
    expect(inspectString(String.fromCharCode(0x80))[0].name).toBe('CONTROL CHARACTER');
    expect(inspectString(String.fromCharCode(0x9F))[0].name).toBe('CONTROL CHARACTER');
  });

  it('leaves printable characters unnamed', () => {
    expect(inspectString('A')[0].name).toBe('');
    expect(inspectString('é')[0].name).toBe('');
  });
});
