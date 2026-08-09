<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { renderMarkdownToSafeHtml } from './markdown-editor.service';

const { t } = useI18n();

const defaultMarkdown = `# Hello, Markdown!

Type on the **left**, see the rendered result on the **right**.

- Live preview
- [Links](https://it-tools.tech)
- \`inline code\`

> Blockquotes work too.
`;

const inputMarkdown = useStorage('markdown-editor:input', defaultMarkdown);
const renderedHtml = computed(() => renderMarkdownToSafeHtml(inputMarkdown.value));
</script>

<template>
  <div flex flex-col gap-3>
    <div flex flex-col gap-3 md:flex-row>
      <c-input-text
        v-model:value="inputMarkdown"
        :label="t('tools.markdown-editor.input.label')"
        :placeholder="t('tools.markdown-editor.input.placeholder')"

        rows="20"

        multiline raw-text monospace autofocus flex-1
      />

      <div flex-1>
        <label class="preview-label">{{ t('tools.markdown-editor.output.label') }}</label>
        <div class="markdown-preview" data-test-id="markdown-preview" v-html="renderedHtml" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.preview-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85em;
  opacity: 0.9;
}

.markdown-preview {
  min-height: 200px;
  padding: 12px 16px;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  overflow-wrap: break-word;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 0.6em 0 0.4em;
    line-height: 1.25;
  }

  :deep(p) {
    margin: 0.5em 0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  :deep(blockquote) {
    margin: 0.5em 0;
    padding-left: 1em;
    border-left: 3px solid rgba(128, 128, 128, 0.4);
    opacity: 0.85;
  }

  :deep(code) {
    padding: 0.15em 0.35em;
    border-radius: 3px;
    background-color: rgba(128, 128, 128, 0.15);
    font-family: monospace;
  }

  :deep(pre) {
    padding: 12px;
    border-radius: 4px;
    background-color: rgba(128, 128, 128, 0.15);
    overflow-x: auto;

    code {
      padding: 0;
      background: none;
    }
  }

  :deep(table) {
    border-collapse: collapse;

    th,
    td {
      padding: 4px 8px;
      border: 1px solid rgba(128, 128, 128, 0.4);
    }
  }

  :deep(img) {
    max-width: 100%;
  }
}
</style>
