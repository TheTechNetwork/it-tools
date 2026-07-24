<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { generateToc } from './markdown-toc-generator.service';

const input = ref('# Introduction\n\n## Getting started\n\n### Installation\n\n### Usage\n\n## API reference\n\n## License');

const bullet = ref('-');
const maxLevel = ref(6);

const bulletOptions = [
  { label: 'Dash (-)', value: '-' },
  { label: 'Asterisk (*)', value: '*' },
  { label: 'Ordered (1.)', value: '1.' },
];

const levelOptions = [2, 3, 4, 5, 6].map(value => ({ label: `H1–H${value}`, value }));

const toc = computed(() => generateToc(input.value, { bullet: bullet.value, maxLevel: maxLevel.value }));

const { copy } = useCopy({ source: toc, text: 'Table of contents copied to the clipboard' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      label="Your Markdown"
      placeholder="Paste your Markdown here..."
      multiline
      rows="10"
      raw-text
      monospace
    />

    <div my-3 flex flex-wrap items-center gap-4>
      <c-select
        v-model:value="bullet"
        label="List style"
        :options="bulletOptions"
        w-48
      />
      <c-select
        v-model:value="maxLevel"
        label="Include up to"
        :options="levelOptions"
        w-40
      />
    </div>

    <c-input-text
      :value="toc"
      label="Table of contents"
      placeholder="The generated table of contents will appear here..."
      multiline
      rows="8"
      readonly
      raw-text
      monospace
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="toc === ''" @click="copy()">
        Copy table of contents
      </c-button>
    </div>
  </div>
</template>
