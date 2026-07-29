import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useCommandPaletteStore } from './command-palette.store';

function withStore() {
  const pinia = createPinia();
  const i18n = createI18n({ legacy: false, globalInjection: true, locale: 'en', messages: { en: {} } });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:all(.*)*', component: defineComponent({ render: () => h('div') }) }],
  });

  let store!: ReturnType<typeof useCommandPaletteStore>;
  const wrapper = mount(
    defineComponent({
      setup() {
        store = useCommandPaletteStore();
        return () => h('div');
      },
    }),
    { global: { plugins: [pinia, i18n, router] } },
  );

  return { store, wrapper, router };
}

function allOptions(store: ReturnType<typeof useCommandPaletteStore>) {
  return Object.values(store.filteredSearchResult).flat();
}

describe('command-palette.store', () => {
  it('starts with an empty prompt and returns grouped results capped at five per category', () => {
    const { store, wrapper } = withStore();

    expect(store.searchPrompt).toBe('');
    // the fuzzy search yields every option for an empty prompt, grouped by
    // category and capped at five entries each
    expect(Object.keys(store.filteredSearchResult).length).toBeGreaterThan(0);
    for (const options of Object.values(store.filteredSearchResult)) {
      expect(options.length).toBeLessThanOrEqual(5);
    }

    wrapper.unmount();
  });

  it('groups matching results by category', async () => {
    const { store, wrapper } = withStore();

    store.searchPrompt = 'toggle dark mode';
    await nextTick();

    expect(Object.keys(store.filteredSearchResult)).toContain('Actions');
    const actionNames = store.filteredSearchResult.Actions.map(option => option.name);
    expect(actionNames).toContain('Toggle dark mode');

    wrapper.unmount();
  });

  it('surfaces the static palette options (external, pages, actions)', async () => {
    const { store, wrapper } = withStore();

    store.searchPrompt = 'github repository';
    await nextTick();
    expect(allOptions(store).some(option => option.name === 'Github repository')).toBe(true);

    store.searchPrompt = 'about';
    await nextTick();
    expect(allOptions(store).some(option => option.name === 'About')).toBe(true);

    store.searchPrompt = 'report a bug';
    await nextTick();
    expect(allOptions(store).some(option => option.name === 'Report a bug or an issue')).toBe(true);

    wrapper.unmount();
  });

  it('limits each category to at most five results', async () => {
    const { store, wrapper } = withStore();

    store.searchPrompt = 'converter';
    await nextTick();

    for (const options of Object.values(store.filteredSearchResult)) {
      expect(options.length).toBeLessThanOrEqual(5);
    }

    wrapper.unmount();
  });

  it('runs the "Random tool" action which navigates to a random tool path', async () => {
    const { store, wrapper, router } = withStore();
    const pushSpy = vi.spyOn(router, 'push');

    store.searchPrompt = 'random tool';
    await nextTick();

    const randomOption = allOptions(store).find(option => option.name === 'Random tool');
    expect(randomOption).toBeDefined();

    randomOption!.action!();

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(typeof pushSpy.mock.calls[0][0]).toBe('string');

    wrapper.unmount();
  });

  it('runs the "Toggle dark mode" action', async () => {
    const { store, wrapper } = withStore();

    store.searchPrompt = 'toggle dark mode';
    await nextTick();

    const toggleOption = allOptions(store).find(option => option.name === 'Toggle dark mode');
    expect(toggleOption).toBeDefined();

    // exercises the styleStore.toggleDark() closure without throwing
    expect(() => toggleOption!.action!()).not.toThrow();

    wrapper.unmount();
  });
});
