import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { computedRefreshable, computedRefreshableAsync } from './computedRefreshable';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('computedRefreshable', () => {
  describe('computedRefreshable', () => {
    it('computes the initial value from the getter', () => {
      const source = ref(2);
      const [value] = computedRefreshable(() => source.value * 2);

      expect(value.value).toBe(4);
    });

    it('recomputes when a reactive dependency changes', async () => {
      const source = ref(1);
      const [value] = computedRefreshable(() => source.value + 10);

      expect(value.value).toBe(11);

      source.value = 5;
      await nextTick();

      expect(value.value).toBe(15);
    });

    it('caches the value until refreshed', () => {
      // Note: watch() also invokes the getter once for dependency tracking,
      // so assertions are relative to the first computed read.
      let callCount = 0;
      const [value] = computedRefreshable(() => {
        callCount += 1;
        return callCount;
      });

      const first = value.value;
      const callCountAfterFirstRead = callCount;

      expect(value.value).toBe(first);
      expect(value.value).toBe(first);
      expect(callCount).toBe(callCountAfterFirstRead);
    });

    it('recomputes an impure getter when refresh is called', () => {
      let callCount = 0;
      const [value, refresh] = computedRefreshable(() => {
        callCount += 1;
        return callCount;
      });

      const first = value.value;

      refresh();

      expect(value.value).toBe(first + 1);
    });

    it('throttles recomputation when the throttle option is set', async () => {
      vi.useFakeTimers();

      try {
        const source = ref(1);
        const [value] = computedRefreshable(() => source.value, { throttle: 100 });

        expect(value.value).toBe(1);

        source.value = 2;
        await nextTick();

        // Leading edge of the throttle updates immediately
        expect(value.value).toBe(2);

        source.value = 3;
        await nextTick();
        source.value = 4;
        await nextTick();

        await vi.advanceTimersByTimeAsync(150);
        await nextTick();

        expect(value.value).toBe(4);
      }
      finally {
        vi.useRealTimers();
      }
    });
  });

  describe('computedRefreshableAsync', () => {
    it('returns the default value until the getter resolves', async () => {
      const source = ref(2);
      const [value] = computedRefreshableAsync(async () => source.value * 2, 0);

      expect(value.value).toBe(0);

      await flushPromises();

      expect(value.value).toBe(4);
    });

    it('recomputes when a reactive dependency changes', async () => {
      const source = ref(1);
      const [value] = computedRefreshableAsync(async () => source.value + 10, 0);

      await flushPromises();
      expect(value.value).toBe(11);

      source.value = 5;
      await flushPromises();

      expect(value.value).toBe(15);
    });

    it('recomputes an impure getter when refresh is called', async () => {
      let callCount = 0;
      const [value, refresh] = computedRefreshableAsync(async () => {
        callCount += 1;
        return callCount;
      }, 0);

      await flushPromises();
      const first = value.value;
      expect(first).toBeGreaterThan(0);

      refresh();
      await flushPromises();

      expect(value.value).toBe(first + 1);
    });
  });
});
