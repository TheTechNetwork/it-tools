<script setup lang="ts">
import { DIFF_LANGUAGES } from '@/ui/c-diff-editor/languages';

const { t } = useI18n();

// Remembered across visits so the diff opens in the language you last used.
const language = useStorage('text-diff:language', 'plaintext');
</script>

<template>
  <div w-full flex flex-col gap-2>
    <c-select
      v-model:value="language"
      :options="DIFF_LANGUAGES"
      :label="t('tools.text-diff.language')"
      searchable
      max-w-260px
    />
    <c-card w-full important:flex-1 important:pa-0>
      <c-diff-editor :language="language" />
    </c-card>
  </div>
</template>
