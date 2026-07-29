import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import { getErrorMessageOrThrown, isFalsyOrHasThrown, useValidation } from './validation';

describe('useValidation', () => {
  describe('isFalsyOrHasThrown', () => {
    it('should return true if the callback return nil, false or throw', () => {
      expect(isFalsyOrHasThrown(() => false)).toBe(true);
      expect(isFalsyOrHasThrown(() => null)).toBe(true);
      expect(isFalsyOrHasThrown(() => undefined)).toBe(true);
      expect(isFalsyOrHasThrown(() => {})).toBe(true);
      expect(
        isFalsyOrHasThrown(() => {
          throw new Error('message');
        }),
      ).toBe(true);
    });

    it('should return true for any truthy values and empty string and 0 values', () => {
      expect(isFalsyOrHasThrown(() => true)).toBe(false);
      expect(isFalsyOrHasThrown(() => 'string')).toBe(false);
      expect(isFalsyOrHasThrown(() => 1)).toBe(false);
      expect(isFalsyOrHasThrown(() => 0)).toBe(false);
      expect(isFalsyOrHasThrown(() => '')).toBe(false);
      expect(isFalsyOrHasThrown(() => [])).toBe(false);
      expect(isFalsyOrHasThrown(() => ({}))).toBe(false);
    });
  });

  describe('getErrorMessageOrThrown', () => {
    it('returns the callback value when it produces a string', () => {
      expect(getErrorMessageOrThrown(() => 'an error message')).toBe('an error message');
    });

    it('returns an empty string when the callback returns a falsy value', () => {
      expect(getErrorMessageOrThrown(() => '')).toBe('');
    });

    it('returns the stringified error when the callback throws', () => {
      expect(
        getErrorMessageOrThrown(() => {
          throw new Error('boom');
        }),
      ).toBe('Error: boom');
    });
  });

  describe('useValidation', () => {
    it('is valid with a clean state when every rule passes', () => {
      const source = ref('valid');
      const validation = useValidation({
        source,
        rules: [{ message: 'should not appear', validator: value => value.length > 0 }],
      });

      expect(validation.isValid).toBe(true);
      expect(validation.status).toBeUndefined();
      expect(validation.message).toBe('');
      expect(validation.attrs.feedback).toBe('');
      expect(validation.attrs.validationStatus).toBeUndefined();
    });

    it('is invalid and exposes the rule message when a rule fails', () => {
      const source = ref('');
      const validation = useValidation({
        source,
        rules: [{ message: 'value is required', validator: value => value.length > 0 }],
      });

      expect(validation.isValid).toBe(false);
      expect(validation.status).toBe('error');
      expect(validation.message).toBe('value is required');
      expect(validation.attrs.feedback).toBe('value is required');
      expect(validation.attrs.validationStatus).toBe('error');
    });

    it('interpolates the getErrorMessage result into the {0} placeholder', () => {
      const source = ref('abc');
      const validation = useValidation({
        source,
        rules: [
          {
            message: 'invalid value: {0}',
            validator: () => false,
            getErrorMessage: value => `"${value}" is not allowed`,
          },
        ],
      });

      expect(validation.message).toBe('invalid value: "abc" is not allowed');
    });

    it('uses the stringified thrown error when getErrorMessage throws', () => {
      const source = ref('abc');
      const validation = useValidation({
        source,
        rules: [
          {
            message: 'invalid: {0}',
            validator: () => false,
            getErrorMessage: () => {
              throw new Error('nope');
            },
          },
        ],
      });

      expect(validation.message).toBe('invalid: Error: nope');
    });

    it('re-runs validation reactively when the source changes', async () => {
      const source = ref('');
      const validation = useValidation({
        source,
        rules: [{ message: 'value is required', validator: value => value.length > 0 }],
      });

      expect(validation.isValid).toBe(false);

      source.value = 'now filled';
      await nextTick();

      expect(validation.isValid).toBe(true);
      expect(validation.status).toBeUndefined();
    });

    it('re-runs validation when a watched ref changes', async () => {
      const source = ref('value');
      const threshold = ref(3);
      const validation = useValidation({
        source,
        watch: [threshold],
        rules: [{ message: 'too short', validator: value => value.length >= threshold.value }],
      });

      expect(validation.isValid).toBe(true);

      threshold.value = 10;
      await nextTick();

      expect(validation.isValid).toBe(false);
      expect(validation.message).toBe('too short');
    });

    it('accepts rules provided as a ref', () => {
      const source = ref('');
      const validation = useValidation({
        source,
        rules: ref([{ message: 'required', validator: (value: string) => value.length > 0 }]),
      });

      expect(validation.isValid).toBe(false);
      expect(validation.message).toBe('required');
    });
  });
});
