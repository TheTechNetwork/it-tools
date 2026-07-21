<script setup lang="ts">
import { computedCatch } from '@/composable/computed/catchedComputed';
import { algos, decryptText, encryptText } from './encryption.service';

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
  defaultErrorMessage: 'Unable to decrypt your text',
});
</script>

<template>
  <c-card title="Encrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        label="Your text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" label="Your secret key:" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          label="Encryption algorithm:"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      label="Your text encrypted:"
      :value="cypherOutput"
      rows="3"
      placeholder="Your string hash"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="Decrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        label="Your encrypted text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" label="Your secret key:" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          label="Encryption algorithm:"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="warning" mt-12 title="Error while decrypting">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      label="Your decrypted text:"
      :value="decryptOutput"
      placeholder="Your string hash"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
