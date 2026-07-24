<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { escapeString, unescapeString } from './string-escape.service';

const mode = ref<'escape' | 'unescape'>('escape');
const input = ref('');

const modeOptions = [
  { label: 'Escape', value: 'escape' },
  { label: 'Unescape', value: 'unescape' },
];

const output = computed(() =>
  withDefaultOnError(
    () => (mode.value === 'escape' ? escapeString(input.value) : unescapeString(input.value)),
    '',
  ),
);

const { copy } = useCopy({ source: output, text: 'Result copied to the clipboard' });
</script>

<template>
  <div>
    <div mb-3 flex justify-center>
      <n-radio-group v-model:value="mode">
        <n-radio-button v-for="option in modeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>
    </div>

    <c-input-text
      v-model:value="input"
      :label="mode === 'escape' ? 'String to escape' : 'String to unescape'"
      :placeholder="mode === 'escape' ? 'Enter a raw string, e.g. a line\nbreak...' : 'Enter an escaped string, e.g. a line\\nbreak...'"
      multiline
      rows="6"
      raw-text
      monospace
    />

    <c-input-text
      :value="output"
      label="Result"
      placeholder="The result will appear here..."
      multiline
      rows="6"
      readonly
      raw-text
      monospace
      mt-4
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="output === ''" @click="copy()">
        Copy result
      </c-button>
    </div>
  </div>
</template>
