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

  it('names common control characters', () => {
    expect(inspectString('\n')[0].name).toBe('LINE FEED (newline)');
    expect(inspectString('\t')[0].name).toBe('CHARACTER TABULATION (tab)');
  });
});
