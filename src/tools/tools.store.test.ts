import type { ToolWithCategory } from './tools.types';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { createI18n } from 'vue-i18n';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useToolStore } from './tools.store';

function withStore() {
  const pinia = createPinia();
  const i18n = createI18n({ legacy: false, globalInjection: true, locale: 'en', messages: { en: {} } });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:all(.*)*', component: defineComponent({ render: () => h('div') }) }],
  });

  let store!: ReturnType<typeof useToolStore>;
  const wrapper = mount(
    defineComponent({
      setup() {
        store = useToolStore();
        return () => h('div');
      },
    }),
    { global: { plugins: [pinia, i18n, router] } },
  );

  return { store, wrapper };
}

describe('tools.store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('exposes the full list of tools, each with a category', () => {
    const { store, wrapper } = withStore();

    expect(store.tools.length).toBeGreaterThan(0);
    for (const tool of store.tools) {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('path');
      expect(tool).toHaveProperty('category');
      expect(typeof tool.category).toBe('string');
    }

    wrapper.unmount();
  });

  it('groups tools by category', () => {
    const { store, wrapper } = withStore();

    expect(store.toolsByCategory.length).toBeGreaterThan(0);
    for (const category of store.toolsByCategory) {
      expect(category).toHaveProperty('name');
      expect(Array.isArray(category.components)).toBe(true);
      expect(category.components.length).toBeGreaterThan(0);
    }

    // the flattened components across categories cover all tools
    const flattened = store.toolsByCategory.flatMap(({ components }) => components);
    expect(flattened.length).toBe(store.tools.length);

    wrapper.unmount();
  });

  it('exposes only the tools flagged as new via newTools', () => {
    const { store, wrapper } = withStore();

    expect(store.newTools.every(tool => tool.isNew)).toBe(true);
    expect(store.newTools.length).toBe(store.tools.filter(({ isNew }) => isNew).length);

    wrapper.unmount();
  });

  it('starts with no favorite tools', () => {
    const { store, wrapper } = withStore();

    expect(store.favoriteTools).toEqual([]);

    wrapper.unmount();
  });

  it('adds a tool to favorites, persists it and reflects it in favoriteTools / isToolFavorite', async () => {
    const { store, wrapper } = withStore();
    const tool = store.tools[0];

    expect(store.isToolFavorite({ tool })).toBe(false);

    store.addToolToFavorites({ tool });
    await nextTick();

    expect(store.isToolFavorite({ tool })).toBe(true);
    expect(store.favoriteTools.map(({ path }) => path)).toContain(tool.path);
    expect(window.localStorage.getItem('favoriteToolsName')).toContain(tool.path);

    wrapper.unmount();
  });

  it('does not add a tool that has no path', () => {
    const { store, wrapper } = withStore();

    store.addToolToFavorites({ tool: { path: '' } as any });

    expect(store.favoriteTools).toEqual([]);

    wrapper.unmount();
  });

  it('accepts a ref-wrapped tool (MaybeRef) when favoriting', async () => {
    const { store, wrapper } = withStore();
    const tool = store.tools[0];

    store.addToolToFavorites({ tool: ref(tool) });
    await nextTick();

    expect(store.isToolFavorite({ tool: ref(tool) })).toBe(true);

    wrapper.unmount();
  });

  it('removes a tool from favorites by path', async () => {
    const { store, wrapper } = withStore();
    const tool = store.tools[0];

    store.addToolToFavorites({ tool });
    await nextTick();
    expect(store.favoriteTools.length).toBe(1);

    store.removeToolFromFavorites({ tool });
    await nextTick();

    expect(store.favoriteTools).toEqual([]);
    expect(store.isToolFavorite({ tool })).toBe(false);

    wrapper.unmount();
  });

  it('matches a favorite stored by name via isToolFavorite and favoriteTools', async () => {
    const { store, wrapper } = withStore();
    const tool = store.tools[0];

    // seed the storage with the tool name rather than its path
    store.updateFavoriteTools([]);
    await nextTick();
    window.localStorage.setItem('favoriteToolsName', JSON.stringify([tool.name]));

    // remounting picks up the seeded storage
    wrapper.unmount();
    const { store: store2, wrapper: wrapper2 } = withStore();
    const tool2 = store2.tools.find(({ name }) => name === tool.name)!;

    expect(store2.isToolFavorite({ tool: tool2 })).toBe(true);
    expect(store2.favoriteTools.map(({ name }) => name)).toContain(tool.name);

    wrapper2.unmount();
  });

  it('removes a favorite stored by name', async () => {
    const { store, wrapper } = withStore();
    const tool = store.tools[0];

    window.localStorage.setItem('favoriteToolsName', JSON.stringify([tool.name]));
    wrapper.unmount();

    const { store: store2, wrapper: wrapper2 } = withStore();
    const tool2 = store2.tools.find(({ name }) => name === tool.name)!;

    store2.removeToolFromFavorites({ tool: tool2 });
    await nextTick();

    expect(store2.isToolFavorite({ tool: tool2 })).toBe(false);

    wrapper2.unmount();
  });

  it('drops unknown favorite names from favoriteTools', async () => {
    const { wrapper } = withStore();

    window.localStorage.setItem('favoriteToolsName', JSON.stringify(['this-tool-does-not-exist']));
    wrapper.unmount();

    const { store: store2, wrapper: wrapper2 } = withStore();

    expect(store2.favoriteTools).toEqual([]);

    wrapper2.unmount();
  });

  it('updates the favorite ordering via updateFavoriteTools', async () => {
    const { store, wrapper } = withStore();
    const [first, second] = store.tools;

    store.updateFavoriteTools([second, first] as ToolWithCategory[]);
    await nextTick();

    expect(store.favoriteTools.map(({ path }) => path)).toEqual([second.path, first.path]);
    expect(JSON.parse(window.localStorage.getItem('favoriteToolsName')!)).toEqual([second.path, first.path]);

    wrapper.unmount();
  });
});
