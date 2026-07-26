<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { generateToc } from './markdown-toc-generator.service';

const { t } = useI18n();

const input = ref('# Introduction\n\n## Getting started\n\n### Installation\n\n### Usage\n\n## API reference\n\n## License');

const bullet = ref('-');
const maxLevel = ref(6);

const bulletOptions = computed(() => [
  { label: t('tools.markdown-toc-generator.bulletDash'), value: '-' },
  { label: t('tools.markdown-toc-generator.bulletAsterisk'), value: '*' },
  { label: t('tools.markdown-toc-generator.bulletOrdered'), value: '1.' },
]);

const levelOptions = computed(() => [2, 3, 4, 5, 6].map(value => ({ label: t('tools.markdown-toc-generator.levelOption', { n: value }), value })));

const toc = computed(() => generateToc(input.value, { bullet: bullet.value, maxLevel: maxLevel.value }));

const { copy } = useCopy({ source: toc, text: t('tools.markdown-toc-generator.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :label="t('tools.markdown-toc-generator.markdownLabel')"
      :placeholder="t('tools.markdown-toc-generator.markdownPlaceholder')"
      multiline
      rows="10"
      raw-text
      monospace
    />

    <div my-3 flex flex-wrap items-center gap-4>
      <c-select
        v-model:value="bullet"
        :label="t('tools.markdown-toc-generator.listStyleLabel')"
        :options="bulletOptions"
        w-48
      />
      <c-select
        v-model:value="maxLevel"
        :label="t('tools.markdown-toc-generator.includeUpToLabel')"
        :options="levelOptions"
        w-40
      />
    </div>

    <c-input-text
      :value="toc"
      :label="t('tools.markdown-toc-generator.tocLabel')"
      :placeholder="t('tools.markdown-toc-generator.tocPlaceholder')"
      multiline
      rows="8"
      readonly
      raw-text
      monospace
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="toc === ''" @click="copy()">
        {{ t('tools.markdown-toc-generator.copyButton') }}
      </c-button>
    </div>
  </div>
</template>
