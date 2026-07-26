<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';

const { t } = useI18n();

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicode(inputText.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <c-card :title="t('tools.text-to-unicode.textToUnicodeTitle')">
    <c-input-text v-model:value="inputText" multiline :placeholder="t('tools.text-to-unicode.textInputPlaceholder')" :label="t('tools.text-to-unicode.textInputLabel')" autosize autofocus raw-text test-id="text-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromText" :label="t('tools.text-to-unicode.unicodeOutputLabel')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-unicode.unicodeOutputPlaceholder')" test-id="text-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromText" @click="copyUnicode()">
        {{ t('tools.text-to-unicode.copyUnicode') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.text-to-unicode.unicodeToTextTitle')">
    <c-input-text v-model:value="inputUnicode" multiline :placeholder="t('tools.text-to-unicode.unicodeInputPlaceholder')" :label="t('tools.text-to-unicode.unicodeInputLabel')" autosize raw-text test-id="unicode-to-text-input" />
    <c-input-text v-model:value="textFromUnicode" :label="t('tools.text-to-unicode.textOutputLabel')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-unicode.textOutputPlaceholder')" test-id="unicode-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUnicode" @click="copyText()">
        {{ t('tools.text-to-unicode.copyText') }}
      </c-button>
    </div>
  </c-card>
</template>
