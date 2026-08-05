<script setup lang="ts">
// Import the slim standalone editor API instead of the full `monaco-editor`
// entry. The text-diff tool only uses a plain-text ('txt') diff editor, so the
// bundled language contributions and their large web-worker chunks (ts.worker
// ~6.9 MB, css/html/json workers) are dead weight. editor.api provides
// createDiffEditor / createModel / defineTheme / setTheme with no languages.
import * as monaco from 'monaco-editor/editor/editor.api';
import { useStyleStore } from '@/stores/style.store';
// Configure the Monaco editor web worker (side-effect import) before any editor
// is created — without it the diff never computes. See monaco-environment.ts.
import './monaco-environment';

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
    // Always render the two panes side by side and keep both editable. Monaco
    // otherwise collapses to a single inline view when the editor is narrower
    // than renderSideBySideInlineBreakpoint (~900px) — e.g. on phones — which
    // hides the original pane and makes only the modified side editable.
    renderSideBySide: true,
    useInlineViewWhenSpaceIsLimited: false,
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
