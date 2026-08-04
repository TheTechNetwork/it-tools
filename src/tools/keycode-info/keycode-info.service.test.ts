import type { KeyboardEventLike } from './keycode-info.service';
import { describe, expect, it } from 'vitest';
import { formatModifiers, getKeyCodeInfo } from './keycode-info.service';

function createEvent(overrides: Partial<KeyboardEventLike> = {}): KeyboardEventLike {
  return {
    key: 'a',
    keyCode: 65,
    code: 'KeyA',
    location: 0,
    metaKey: false,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    ...overrides,
  };
}

describe('keycode-info', () => {
  describe('formatModifiers', () => {
    it('returns an empty string when no modifier is pressed', () => {
      expect(formatModifiers(createEvent())).toBe('');
    });

    it('formats a single modifier', () => {
      expect(formatModifiers(createEvent({ shiftKey: true }))).toBe('Shift');
    });

    it('joins multiple modifiers in a stable Meta/Shift/Ctrl/Alt order', () => {
      expect(
        formatModifiers(createEvent({ altKey: true, ctrlKey: true, metaKey: true, shiftKey: true })),
      ).toBe('Meta + Shift + Ctrl + Alt');
    });

    it('preserves order regardless of which combination is active', () => {
      expect(formatModifiers(createEvent({ ctrlKey: true, altKey: true }))).toBe('Ctrl + Alt');
    });
  });

  describe('getKeyCodeInfo', () => {
    it('maps a KeyboardEvent to string fields', () => {
      const info = getKeyCodeInfo(createEvent({ key: 'Enter', keyCode: 13, code: 'Enter', location: 0 }));

      expect(info).toEqual({
        key: 'Enter',
        keyCode: '13',
        code: 'Enter',
        location: '0',
        modifiers: '',
      });
    });

    it('stringifies numeric keyCode and location', () => {
      const info = getKeyCodeInfo(createEvent({ keyCode: 16, location: 1, shiftKey: true, key: 'Shift', code: 'ShiftLeft' }));

      expect(info.keyCode).toBe('16');
      expect(info.location).toBe('1');
      expect(info.modifiers).toBe('Shift');
    });
  });
});
