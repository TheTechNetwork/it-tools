import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import { computedCatch } from './catchedComputed';

describe('computedCatch', () => {
  it('returns the computed value and no error when the getter succeeds', () => {
    const source = ref(2);
    const [value, error] = computedCatch(() => source.value * 2, { defaultValue: 0 });

    expect(value.value).toBe(4);
    expect(error.value).toBeUndefined();
  });

  it('recomputes when a reactive dependency changes', async () => {
    const source = ref(1);
    const [value] = computedCatch(() => source.value + 10, { defaultValue: 0 });

    expect(value.value).toBe(11);

    source.value = 5;
    await nextTick();

    expect(value.value).toBe(15);
  });

  it('returns the default value and the error message when the getter throws', () => {
    const [value, error] = computedCatch<number, number>(() => {
      throw new Error('boom');
    }, { defaultValue: -1 });

    expect(value.value).toBe(-1);
    expect(error.value).toBe('boom');
  });

  it('recovers when the getter stops throwing', async () => {
    const source = ref(-1);
    const [value, error] = computedCatch(() => {
      if (source.value < 0) {
        throw new Error('negative value');
      }
      return source.value;
    }, { defaultValue: 0 });

    expect(value.value).toBe(0);
    expect(error.value).toBe('negative value');

    source.value = 42;
    await nextTick();

    expect(value.value).toBe(42);
    expect(error.value).toBeUndefined();
  });

  it('errors again when the getter throws after a success', async () => {
    const source = ref(1);
    const [value, error] = computedCatch(() => {
      if (source.value < 0) {
        throw new Error('negative value');
      }
      return source.value;
    }, { defaultValue: 0 });

    expect(value.value).toBe(1);
    expect(error.value).toBeUndefined();

    source.value = -5;
    await nextTick();

    expect(value.value).toBe(0);
    expect(error.value).toBe('negative value');
  });

  it('stringifies non-Error thrown values', () => {
    const [value, error] = computedCatch<number, number>(() => {
      // eslint-disable-next-line no-throw-literal
      throw 'string error';
    }, { defaultValue: 0 });

    expect(value.value).toBe(0);
    expect(error.value).toBe('string error');
  });

  it('uses the default error message when the thrown value is nullish', () => {
    const [, error] = computedCatch<number, number>(() => {
      // eslint-disable-next-line no-throw-literal
      throw null;
    }, { defaultValue: 0 });

    expect(error.value).toBe('Unknown error');
  });

  it('uses a custom default error message when provided', () => {
    const [, error] = computedCatch<number, number>(() => {
      // eslint-disable-next-line no-throw-literal
      throw null;
    }, { defaultValue: 0, defaultErrorMessage: 'Custom fallback' });

    expect(error.value).toBe('Custom fallback');
  });
});
