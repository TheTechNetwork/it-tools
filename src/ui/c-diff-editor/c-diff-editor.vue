<script setup lang="ts">
// Import the slim standalone editor API instead of the full `monaco-editor`
// entry. The bundled language contributions and their large web-worker chunks
// (ts.worker ~6.9 MB, css/html/json workers) are dead weight; editor.api
// provides createDiffEditor / createModel / defineTheme / setTheme with no
// languages. Syntax highlighting for the offered languages is registered
// separately via main-thread Monarch grammars — see languages.ts.
import * as monaco from 'monaco-editor/editor/editor.api';
import { useStyleStore } from '@/stores/style.store';
// Configure the Monaco web worker (side-effect import) before any editor is
// created — without it the diff never computes. See monaco-environment.ts.
import './monaco-environment';
// Register the syntax-highlighting grammars for the languages we offer.
import './languages';

const props = withDefaults(
  defineProps<{ options?: monaco.editor.IDiffEditorOptions; language?: string }>(),
  { options: () => ({}), language: 'plaintext' },
);
const { options, language } = toRefs(props);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneDiffEditor | null = null;
let originalModel: monaco.editor.ITextModel | null = null;
let modifiedModel: monaco.editor.ITextModel | null = null;

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

// Re-tag both models when the selected language changes, so highlighting
// switches live without recreating the editor or losing the entered text.
watch(language, (lang) => {
  if (originalModel) {
    monaco.editor.setModelLanguage(originalModel, lang);
  }
  if (modifiedModel) {
    monaco.editor.setModelLanguage(modifiedModel, lang);
  }
});

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

  originalModel = monaco.editor.createModel('original text', language.value);
  modifiedModel = monaco.editor.createModel('modified text', language.value);
  editor.setModel({ original: originalModel, modified: modifiedModel });
});

// Dispose the editor and both models on unmount so navigating away and back
// doesn't leak Monaco editors/models.
onUnmounted(() => {
  editor?.dispose();
  originalModel?.dispose();
  modifiedModel?.dispose();
});
</script>

<template>
  <div ref="editorContainer" h-600px />
</template>
