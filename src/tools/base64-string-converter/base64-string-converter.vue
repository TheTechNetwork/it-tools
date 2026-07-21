<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { base64ToString, isBase64StringValid, stringToBase64 } from './base64-string-converter.service';

const encodeUrlSafe = useStorage('base64-string-converter--encode-url-safe', false);
const decodeUrlSafe = useStorage('base64-string-converter--decode-url-safe', false);

const textInput = ref('');
const base64Output = computed(() => stringToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: 'Base64 string copied to the clipboard' });

const base64Input = ref('');
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToString(base64Input.value, { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: 'String copied to the clipboard' });
const b64ValidationRules = [
  {
    message: 'Invalid base64 string',
    validator: (value: string) => isBase64StringValid(value, { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card title="String to base64">
    <n-form-item label="Encode URL safe" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="Put your string here..."
      rows="5"
      label="String to encode"
      raw-text
      mb-5
    />

    <c-input-text
      label="Base64 of string"
      :value="base64Output"
      multiline
      readonly
      placeholder="The base64 encoding of your string will be here"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        Copy base64
      </c-button>
    </div>
  </c-card>

  <c-card title="Base64 to string">
    <n-form-item label="Decode URL safe" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      placeholder="Your base64 string..."
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      label="Base64 string to decode"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      label="Decoded string"
      placeholder="The decoded string will be here"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        Copy decoded string
      </c-button>
    </div>
  </c-card>
</template>
