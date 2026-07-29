import { colord } from 'colord';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { buildColorFormat, removeAlphaChannelWhenOpaque } from './color-converter.models';

describe('color-converter models', () => {
  describe('removeAlphaChannelWhenOpaque', () => {
    it('remove alpha channel of an hex color when it is opaque (alpha = 1)', () => {
      expect(removeAlphaChannelWhenOpaque('#000000ff')).toBe('#000000');
      expect(removeAlphaChannelWhenOpaque('#ffffffFF')).toBe('#ffffff');
      expect(removeAlphaChannelWhenOpaque('#000000FE')).toBe('#000000FE');
      expect(removeAlphaChannelWhenOpaque('#00000000')).toBe('#00000000');
    });
  });

  describe('buildColorFormat', () => {
    it('uses default options for type, parse and placeholder', () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
      });

      expect(format.type).toBe('text');
      expect(format.label).toBe('Hex');
      expect(format.placeholder).toBeUndefined();
      expect(format.value.value).toBe('');
      expect(format.validation).toBeDefined();
    });

    it('honours the provided type and placeholder', () => {
      const format = buildColorFormat({
        label: 'Picker',
        format: value => value.toHex(),
        type: 'color-picker',
        placeholder: 'Pick a color',
      });

      expect(format.type).toBe('color-picker');
      expect(format.placeholder).toBe('Pick a color');
    });

    it('parses valid values using the default parser', () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
      });

      const parsed = format.parse('#ffffff');
      expect(parsed).toBeDefined();
      expect(format.format(parsed!)).toBe('#ffffff');
    });

    it('returns undefined when the parser throws', () => {
      const format = buildColorFormat({
        label: 'Throwing',
        parse: () => {
          throw new Error('cannot parse');
        },
        format: value => value.toHex(),
      });

      expect(format.parse('anything')).toBeUndefined();
    });

    it('uses a custom parser when provided', () => {
      const format = buildColorFormat({
        label: 'Custom',
        parse: value => colord(`#${value}`),
        format: value => value.toHex(),
      });

      const parsed = format.parse('ff0000');
      expect(parsed).toBeDefined();
      expect(format.format(parsed!)).toBe('#ff0000');
    });

    it('validates an empty value as valid', () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
      });

      // validation runs immediately with the empty initial value
      expect(format.validation.isValid).toBe(true);
    });

    it('validates a correct value once the value changes', async () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
      });

      format.value.value = '#ff0000';
      await nextTick();

      expect(format.validation.isValid).toBe(true);
    });

    it('flags an invalid value with the default message', async () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
      });

      format.value.value = 'not-a-color';
      await nextTick();

      expect(format.validation.isValid).toBe(false);
      expect(format.validation.message).toBe('Invalid hex format.');
    });

    it('flags an invalid value with a custom message', async () => {
      const format = buildColorFormat({
        label: 'Hex',
        format: value => value.toHex(),
        invalidMessage: 'Nope, wrong color.',
      });

      format.value.value = 'not-a-color';
      await nextTick();

      expect(format.validation.isValid).toBe(false);
      expect(format.validation.message).toBe('Nope, wrong color.');
    });

    it('treats a throwing parser as invalid during validation', async () => {
      const format = buildColorFormat({
        label: 'Throwing',
        parse: (value) => {
          if (value === '') {
            return colord('#000000');
          }
          throw new Error('cannot parse');
        },
        format: value => value.toHex(),
      });

      format.value.value = 'boom';
      await nextTick();

      expect(format.validation.isValid).toBe(false);
    });
  });
});
