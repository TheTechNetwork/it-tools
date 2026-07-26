<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { escapeString, unescapeString } from './string-escape.service';

const { t } = useI18n();

const mode = ref<'escape' | 'unescape'>('escape');
const input = ref('');

const modeOptions = computed(() => [
  { label: t('tools.string-escape.escape'), value: 'escape' },
  { label: t('tools.string-escape.unescape'), value: 'unescape' },
]);

const output = computed(() =>
  withDefaultOnError(
    () => (mode.value === 'escape' ? escapeString(input.value) : unescapeString(input.value)),
    '',
  ),
);

const { copy } = useCopy({ source: output, text: t('tools.string-escape.copied') });
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
      :label="mode === 'escape' ? t('tools.string-escape.stringToEscape') : t('tools.string-escape.stringToUnescape')"
      :placeholder="mode === 'escape' ? t('tools.string-escape.escapePlaceholder') : t('tools.string-escape.unescapePlaceholder')"
      multiline
      rows="6"
      raw-text
      monospace
    />

    <c-input-text
      :value="output"
      :label="t('tools.string-escape.result')"
      :placeholder="t('tools.string-escape.resultPlaceholder')"
      multiline
      rows="6"
      readonly
      raw-text
      monospace
      mt-4
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="output === ''" @click="copy()">
        {{ t('tools.string-escape.copyResult') }}
      </c-button>
    </div>
  </div>
</template>
