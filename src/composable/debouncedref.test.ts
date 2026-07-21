import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useDebouncedRef from './debouncedref';

describe('useDebouncedRef', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const value = useDebouncedRef('initial', 100);

    expect(value.value).toBe('initial');
  });

  it('does not update the value before the delay has elapsed', () => {
    const value = useDebouncedRef('initial', 100);

    value.value = 'updated';

    expect(value.value).toBe('initial');

    vi.advanceTimersByTime(50);

    expect(value.value).toBe('initial');
  });

  it('updates the value after the delay has elapsed', () => {
    const value = useDebouncedRef('initial', 100);

    value.value = 'updated';
    vi.advanceTimersByTime(100);

    expect(value.value).toBe('updated');
  });

  it('only applies the last of several rapid updates', () => {
    const value = useDebouncedRef('initial', 100);

    value.value = 'first';
    vi.advanceTimersByTime(50);
    value.value = 'second';
    vi.advanceTimersByTime(50);
    value.value = 'third';
    vi.advanceTimersByTime(100);

    expect(value.value).toBe('third');
  });

  it('updates immediately on the leading edge when immediate is true', () => {
    const value = useDebouncedRef('initial', 100, true);

    value.value = 'updated';

    expect(value.value).toBe('updated');
  });

  it('debounces subsequent updates even when immediate is true', () => {
    const value = useDebouncedRef('initial', 100, true);

    value.value = 'first';
    expect(value.value).toBe('first');

    value.value = 'second';
    expect(value.value).toBe('first');

    vi.advanceTimersByTime(100);

    expect(value.value).toBe('second');
  });

  it('works with non-string values', () => {
    const value = useDebouncedRef(0, 100);

    value.value = 42;
    vi.advanceTimersByTime(100);

    expect(value.value).toBe(42);
  });
});
