<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { convertMarkdownToHtml } from './markdown-to-html.service';

const { t } = useI18n();

const inputMarkdown = ref('');
const outputHtml = computed(() => convertMarkdownToHtml(inputMarkdown.value));

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      :placeholder="t('tools.markdown-to-html.input.placeholder')"
      rows="8"
      autofocus
      :label="t('tools.markdown-to-html.input.label')"
    />

    <n-divider />

    <n-form-item :label="t('tools.markdown-to-html.output.label')">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </n-form-item>

    <div flex justify-center>
      <n-button @click="printHtml">
        {{ t('tools.markdown-to-html.button.print') }}
      </n-button>
    </div>
  </div>
</template>
