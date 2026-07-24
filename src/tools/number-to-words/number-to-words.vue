<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { numberToWords } from './number-to-words.service';

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
const { copy } = useCopy({ source: words, text: 'Words copied to the clipboard' });
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="Number"
      placeholder="Enter a number, e.g. 1234.56"
      monospace
    />

    <n-alert v-if="result.error" type="error" mt-3 :show-icon="false">
      {{ result.error }}
    </n-alert>

    <c-input-text
      v-else
      :value="words"
      label="In words"
      readonly
      multiline
      autosize
      rows="2"
      mt-3
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="words === ''" @click="copy()">
        Copy words
      </c-button>
    </div>
  </c-card>
</template>
