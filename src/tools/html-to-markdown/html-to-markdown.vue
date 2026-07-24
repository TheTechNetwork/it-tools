<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { convertHtmlToMarkdown } from './html-to-markdown.service';

const transformer = (value: string) => withDefaultOnError(() => convertHtmlToMarkdown(value), '');
</script>

<template>
  <format-transformer
    input-label="Your HTML"
    input-placeholder="Paste your HTML here..."
    output-label="Markdown from your HTML"
    output-language="markdown"
    download-file-name="content.md"
    :transformer="transformer"
  />
</template>
