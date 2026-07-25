<script setup lang="ts">
import { computedCatch } from '@/composable/computed/catchedComputed';
import { algos, decryptText, encryptText } from './encryption.service';

const { t } = useI18n();

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() =>
  encryptText({ text: cypherInput.value, secret: cypherSecret.value, algo: cypherAlgo.value }),
);

const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('my secret key');
const [decryptOutput, decryptError] = computedCatch(() => decryptText({ text: decryptInput.value, secret: decryptSecret.value, algo: decryptAlgo.value }), {
  defaultValue: '',
  defaultErrorMessage: t('tools.encryption.unableToDecrypt'),
});
</script>

<template>
  <c-card :title="t('tools.encryption.encrypt.title')">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        :label="t('tools.encryption.encrypt.textLabel')"
        :placeholder="t('tools.encryption.encrypt.textPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" :label="t('tools.encryption.secretKey')" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          :label="t('tools.encryption.algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      :label="t('tools.encryption.encrypt.outputLabel')"
      :value="cypherOutput"
      rows="3"
      :placeholder="t('tools.encryption.outputPlaceholder')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card :title="t('tools.encryption.decrypt.title')">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        :label="t('tools.encryption.decrypt.textLabel')"
        :placeholder="t('tools.encryption.encrypt.textPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" :label="t('tools.encryption.secretKey')" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          :label="t('tools.encryption.algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="warning" mt-12 :title="t('tools.encryption.decrypt.errorTitle')">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      :label="t('tools.encryption.decrypt.outputLabel')"
      :value="decryptOutput"
      :placeholder="t('tools.encryption.outputPlaceholder')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
