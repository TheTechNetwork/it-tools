<script setup lang="ts">
// Import the slim standalone editor API instead of the full `monaco-editor`
// entry. The text-diff tool only uses a plain-text ('txt') diff editor, so the
// bundled language contributions and their large web-worker chunks (ts.worker
// ~6.9 MB, css/html/json workers) are dead weight. editor.api provides
// createDiffEditor / createModel / defineTheme / setTheme with no languages.
// Runtime worker behaviour is unchanged: no MonacoEnvironment is configured
// here (there was none before either), so this only removes unused bundles.
import * as monaco from 'monaco-editor/editor/editor.api';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(defineProps<{ options?: monaco.editor.IDiffEditorOptions }>(), { options: () => ({}) });
const { options } = toRefs(props);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneDiffEditor | null = null;

monaco.editor.defineTheme('it-tools-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
  },
});

monaco.editor.defineTheme('it-tools-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
  },
});

const styleStore = useStyleStore();

watch(
  () => styleStore.isDarkTheme,
  isDarkTheme => monaco.editor.setTheme(isDarkTheme ? 'it-tools-dark' : 'it-tools-light'),
  { immediate: true },
);

watch(
  () => options.value,
  options => editor?.updateOptions(options),
  { immediate: true, deep: true },
);

useResizeObserver(editorContainer, () => {
  editor?.layout();
});

onMounted(() => {
  if (!editorContainer.value) {
    return;
  }

  editor = monaco.editor.createDiffEditor(editorContainer.value, {
    originalEditable: true,
    minimap: {
      enabled: false,
    },
  });

  editor.setModel({
    original: monaco.editor.createModel('original text', 'txt'),
    modified: monaco.editor.createModel('modified text', 'txt'),
  });
});
</script>

<template>
  <div ref="editorContainer" h-600px />
</template>
