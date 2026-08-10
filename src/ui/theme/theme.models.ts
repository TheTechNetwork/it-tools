import { useStyleStore } from '@/stores/style.store';

export function defineThemes<Theme>(themes: { light: Theme; dark: Theme }) {
  return {
    themes,
    useTheme() {
      const styleStore = useStyleStore();
      return computed(() => themes[styleStore.isDarkTheme ? 'dark' : 'light']);
    },
  };
}
