import { describe, expect, it } from 'vitest';
import { escapeUnicode, getEmojiCodePoints } from './emoji-picker.service';

describe('emoji-picker', () => {
  describe('escapeUnicode', () => {
    it('escapes a single BMP character to a padded \\uXXXX sequence', () => {
      expect(escapeUnicode({ emoji: 'A' })).toBe('\\u0041');
    });

    it('escapes each UTF-16 code unit of a surrogate-pair emoji', () => {
      // 😀 is U+1F600, encoded as the surrogate pair D83D DE00
      expect(escapeUnicode({ emoji: '😀' })).toBe('\\ud83d\\ude00');
    });

    it('escapes every code unit of a multi-codepoint emoji', () => {
      // ❤️ is U+2764 U+FE0F
      expect(escapeUnicode({ emoji: '❤️' })).toBe('\\u2764\\ufe0f');
    });

    it('returns an empty string for empty input', () => {
      expect(escapeUnicode({ emoji: '' })).toBe('');
    });
  });

  describe('getEmojiCodePoints', () => {
    it('returns the 0x-prefixed hex code point of the first character', () => {
      expect(getEmojiCodePoints({ emoji: '😀' })).toBe('0x1f600');
    });

    it('reads the full code point of a surrogate pair, not the lead surrogate', () => {
      expect(getEmojiCodePoints({ emoji: '🎉' })).toBe('0x1f389');
    });

    it('handles a plain ASCII character', () => {
      expect(getEmojiCodePoints({ emoji: 'A' })).toBe('0x41');
    });

    it('returns undefined for empty input', () => {
      expect(getEmojiCodePoints({ emoji: '' })).toBeUndefined();
    });
  });
});
