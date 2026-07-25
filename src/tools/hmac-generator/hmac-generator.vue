<script setup lang="ts">
import type { Encoding } from './hmac-generator.service';
import { useCopy } from '@/composable/copy';
import { algos, computeHmac } from './hmac-generator.service';

const { t } = useI18n();

const plainText = ref('');
const secret = ref('');
const hashFunction = ref<keyof typeof algos>('SHA256');
const encoding = ref<Encoding>('Hex');
const hmac = computed(() =>
  computeHmac({
    plainText: plainText.value,
    secret: secret.value,
    hashFunction: hashFunction.value,
    encoding: encoding.value,
  }),
);
const { copy } = useCopy({ source: hmac });
</script>

<template>
  <div flex flex-col gap-4>
    <c-input-text v-model:value="plainText" multiline raw-text :placeholder="t('tools.hmac-generator.plainTextPlaceholder')" rows="3" autosize autofocus :label="t('tools.hmac-generator.plainTextLabel')" />
    <c-input-text v-model:value="secret" raw-text :placeholder="t('tools.hmac-generator.secretPlaceholder')" :label="t('tools.hmac-generator.secretLabel')" clearable />

    <div flex gap-2>
      <c-select
        v-model:value="hashFunction" :label="t('tools.hmac-generator.hashingFunction')"
        flex-1
        :placeholder="t('tools.hmac-generator.hashingFunctionPlaceholder')"
        :options="Object.keys(algos).map((label) => ({ label, value: label }))"
      />
      <c-select
        v-model:value="encoding" :label="t('tools.hmac-generator.outputEncoding')"
        flex-1
        :placeholder="t('tools.hmac-generator.outputEncodingPlaceholder')"
        :options="[
          {
            label: t('tools.hmac-generator.encoding.binary'),
            value: 'Bin',
          },
          {
            label: t('tools.hmac-generator.encoding.hexadecimal'),
            value: 'Hex',
          },
          {
            label: t('tools.hmac-generator.encoding.base64'),
            value: 'Base64',
          },
          {
            label: t('tools.hmac-generator.encoding.base64url'),
            value: 'Base64url',
          },
        ]"
      />
    </div>
    <input-copyable v-model:value="hmac" type="textarea" :placeholder="t('tools.hmac-generator.hmacPlaceholder')" :label="t('tools.hmac-generator.hmacLabel')" />
    <div flex justify-center>
      <c-button @click="copy()">
        {{ t('tools.hmac-generator.copyHmac') }}
      </c-button>
    </div>
  </div>
</template>
