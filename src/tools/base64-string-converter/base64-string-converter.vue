<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { base64ToString, isBase64StringValid, stringToBase64 } from './base64-string-converter.service';

const { t } = useI18n();

const encodeUrlSafe = useStorage('base64-string-converter--encode-url-safe', false);
const decodeUrlSafe = useStorage('base64-string-converter--decode-url-safe', false);

const textInput = ref('');
const base64Output = computed(() => stringToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: t('tools.base64-string-converter.copied.base64') });

const base64Input = ref('');
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToString(base64Input.value, { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: t('tools.base64-string-converter.copied.string') });
const b64ValidationRules = [
  {
    message: t('tools.base64-string-converter.validation.invalid'),
    validator: (value: string) => isBase64StringValid(value, { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card :title="t('tools.base64-string-converter.sections.stringToBase64')">
    <n-form-item :label="t('tools.base64-string-converter.encodeUrlSafe')" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.base64-string-converter.input.placeholder')"
      rows="5"
      :label="t('tools.base64-string-converter.input.label')"
      raw-text
      mb-5
    />

    <c-input-text
      :label="t('tools.base64-string-converter.output.label')"
      :value="base64Output"
      multiline
      readonly
      :placeholder="t('tools.base64-string-converter.output.placeholder')"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        {{ t('tools.base64-string-converter.button.copyBase64') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.base64-string-converter.sections.base64ToString')">
    <n-form-item :label="t('tools.base64-string-converter.decodeUrlSafe')" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      :placeholder="t('tools.base64-string-converter.b64input.placeholder')"
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      :label="t('tools.base64-string-converter.b64input.label')"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      :label="t('tools.base64-string-converter.decoded.label')"
      :placeholder="t('tools.base64-string-converter.decoded.placeholder')"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        {{ t('tools.base64-string-converter.button.copyDecoded') }}
      </c-button>
    </div>
  </c-card>
</template>
