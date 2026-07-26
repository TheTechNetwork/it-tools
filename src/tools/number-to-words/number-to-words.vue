<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { numberToWords } from './number-to-words.service';

const { t } = useI18n();

const input = ref('1234');

const result = computed(() => {
  try {
    return { words: numberToWords(input.value), error: '' };
  }
  catch (error: any) {
    return { words: '', error: error.message ?? String(error) };
  }
});

const words = computed(() => result.value.words);
const { copy } = useCopy({ source: words, text: t('tools.number-to-words.copied') });
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      :label="t('tools.number-to-words.numberLabel')"
      :placeholder="t('tools.number-to-words.numberPlaceholder')"
      monospace
    />

    <n-alert v-if="result.error" type="error" mt-3 :show-icon="false">
      {{ result.error }}
    </n-alert>

    <c-input-text
      v-else
      :value="words"
      :label="t('tools.number-to-words.inWords')"
      readonly
      multiline
      autosize
      rows="2"
      mt-3
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="words === ''" @click="copy()">
        {{ t('tools.number-to-words.copyWords') }}
      </c-button>
    </div>
  </c-card>
</template>
