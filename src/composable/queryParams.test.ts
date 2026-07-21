import type { LocationQueryRaw } from 'vue-router';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useQueryParam, useQueryParamOrStorage } from './queryParams';

// useRouteQuery flushes its write queue on nextTick and then performs an async
// router navigation, so a macrotask flush is needed before asserting the query
async function flushRouteWrites() {
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 0));
}

async function withSetup<T>(composable: () => T, { initialQuery = {} }: { initialQuery?: LocationQueryRaw } = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: defineComponent({ render: () => h('div') }) }],
  });

  await router.push({ path: '/', query: initialQuery });
  await router.isReady();

  let result!: T;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = composable();
        return () => h('div');
      },
    }),
    { global: { plugins: [router] } },
  );

  return { result, router, wrapper };
}

describe('useQueryParam', () => {
  it('returns the default value when the query param is absent', async () => {
    const { result, wrapper } = await withSetup(() => useQueryParam({ name: 'q', defaultValue: 'fallback' }));

    expect(result.value).toBe('fallback');
    wrapper.unmount();
  });

  it('reads a string value from the query', async () => {
    const { result, wrapper } = await withSetup(
      () => useQueryParam({ name: 'q', defaultValue: 'fallback' }),
      { initialQuery: { q: 'from-query' } },
    );

    expect(result.value).toBe('from-query');
    wrapper.unmount();
  });

  it('parses a number value from the query', async () => {
    const { result, wrapper } = await withSetup(
      () => useQueryParam({ name: 'n', defaultValue: 0 }),
      { initialQuery: { n: '42' } },
    );

    expect(result.value).toBe(42);
    wrapper.unmount();
  });

  it('parses a boolean value from the query', async () => {
    const { result: truthy, wrapper: wrapperA } = await withSetup(
      () => useQueryParam({ name: 'b', defaultValue: false }),
      { initialQuery: { b: 'true' } },
    );
    expect(truthy.value).toBe(true);
    wrapperA.unmount();

    const { result: falsy, wrapper: wrapperB } = await withSetup(
      () => useQueryParam({ name: 'b', defaultValue: true }),
      { initialQuery: { b: 'false' } },
    );
    expect(falsy.value).toBe(false);
    wrapperB.unmount();
  });

  it('parses an object value from the query', async () => {
    const { result, wrapper } = await withSetup(
      () => useQueryParam<{ a: number }>({ name: 'o', defaultValue: { a: 0 } }),
      { initialQuery: { o: JSON.stringify({ a: 7 }) } },
    );

    expect(result.value).toEqual({ a: 7 });
    wrapper.unmount();
  });

  it('writes the value back to the route query', async () => {
    const { result, router, wrapper } = await withSetup(() => useQueryParam({ name: 'n', defaultValue: 0 }));

    result.value = 5;
    await flushRouteWrites();

    expect(router.currentRoute.value.query.n).toBe('5');
    expect(result.value).toBe(5);
    wrapper.unmount();
  });
});

describe('useQueryParamOrStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('returns the default value when neither query nor storage is set', async () => {
    const { result, wrapper } = await withSetup(
      () => useQueryParamOrStorage({ name: 'p', storageName: 'test-storage-a', defaultValue: 'fallback' }),
    );

    expect(result.value).toBe('fallback');
    wrapper.unmount();
  });

  it('prefers the query param over the stored value', async () => {
    window.localStorage.setItem('test-storage-b', 'from-storage');

    const { result, wrapper } = await withSetup(
      () => useQueryParamOrStorage({ name: 'p', storageName: 'test-storage-b', defaultValue: 'fallback' }),
      { initialQuery: { p: 'from-query' } },
    );

    expect(result.value).toBe('from-query');
    wrapper.unmount();
  });

  it('falls back to the stored value when the query param is absent', async () => {
    window.localStorage.setItem('test-storage-c', 'from-storage');

    const { result, wrapper } = await withSetup(
      () => useQueryParamOrStorage({ name: 'p', storageName: 'test-storage-c', defaultValue: 'fallback' }),
    );

    expect(result.value).toBe('from-storage');
    wrapper.unmount();
  });

  it('persists updates to both the route query and the storage', async () => {
    const { result, router, wrapper } = await withSetup(
      () => useQueryParamOrStorage({ name: 'n', storageName: 'test-storage-d', defaultValue: 0 }),
    );

    result.value = 9;
    await flushRouteWrites();

    expect(window.localStorage.getItem('test-storage-d')).toBe('9');
    expect(router.currentRoute.value.query.n).toBe('9');
    wrapper.unmount();
  });

  it('supports number values from the query', async () => {
    const { result, wrapper } = await withSetup(
      () => useQueryParamOrStorage({ name: 'n', storageName: 'test-storage-e', defaultValue: 0 }),
      { initialQuery: { n: '33' } },
    );

    expect(result.value).toBe(33);
    wrapper.unmount();
  });
});
