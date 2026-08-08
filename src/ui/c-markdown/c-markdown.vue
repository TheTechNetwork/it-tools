<script setup lang="ts">
// @ts-nocheck
import DomPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' });
const { markdown } = toRefs(props);

const md = new MarkdownIt();

// Render links with the app's styling and open them safely in a new tab.
const renderToken = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultLinkOpen = md.renderer.rules.link_open ?? renderToken;
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  token.attrSet('class', 'text-primary transition decoration-none hover:underline');
  token.attrSet('target', '_blank');
  token.attrSet('rel', 'noopener');
  return defaultLinkOpen(tokens, idx, options, env, self);
};

const html = computed(() => DomPurify.sanitize(md.render(markdown.value), { ADD_ATTR: ['target'] }));
</script>

<template>
  <div v-html="html" />
</template>
