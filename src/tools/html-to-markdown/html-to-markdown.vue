<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { convertHtmlToMarkdown } from './html-to-markdown.service';

const { t } = useI18n();

const transformer = (value: string) => withDefaultOnError(() => convertHtmlToMarkdown(value), '');
</script>

<template>
  <format-transformer
    :input-label="t('tools.html-to-markdown.inputLabel')"
    :input-placeholder="t('tools.html-to-markdown.inputPlaceholder')"
    :output-label="t('tools.html-to-markdown.outputLabel')"
    output-language="markdown"
    download-file-name="content.md"
    :transformer="transformer"
  />
</template>
