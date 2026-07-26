<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { decodeUrlString, encodeUrlString } from './url-encoder.service';

const { t } = useI18n();

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeUrlString(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: (value: string) => isNotThrowing(() => encodeUrlString(value)),
      message: t('tools.url-encoder.parseError'),
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: t('tools.url-encoder.encodedCopied') });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeUrlString(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: decodeInput,
  rules: [
    {
      validator: (value: string) => isNotThrowing(() => decodeUrlString(value)),
      message: t('tools.url-encoder.parseError'),
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: t('tools.url-encoder.decodedCopied') });
</script>

<template>
  <c-card :title="t('tools.url-encoder.encode.title')">
    <c-input-text
      v-model:value="encodeInput"
      :label="t('tools.url-encoder.encode.inputLabel')"
      :validation="encodedValidation"
      multiline
      autosize
      :placeholder="t('tools.url-encoder.encode.inputPlaceholder')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="t('tools.url-encoder.encode.outputLabel')"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      :placeholder="t('tools.url-encoder.encode.outputPlaceholder')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        {{ t('tools.url-encoder.button.copy') }}
      </c-button>
    </div>
  </c-card>
  <c-card :title="t('tools.url-encoder.decode.title')">
    <c-input-text
      v-model:value="decodeInput"
      :label="t('tools.url-encoder.decode.inputLabel')"
      :validation="decodeValidation"
      multiline
      autosize
      :placeholder="t('tools.url-encoder.decode.inputPlaceholder')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="t('tools.url-encoder.decode.outputLabel')"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      :placeholder="t('tools.url-encoder.decode.outputPlaceholder')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        {{ t('tools.url-encoder.button.copy') }}
      </c-button>
    </div>
  </c-card>
</template>
