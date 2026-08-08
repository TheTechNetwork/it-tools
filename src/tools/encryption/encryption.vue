<script setup lang="ts">
import type { CipherAlgorithm } from './encryption.service';
import { computedCatch } from '@/composable/computed/catchedComputed';
import { cipherAlgorithms, decryptText, encryptText } from './encryption.service';

const { t } = useI18n();

// The key derivation (scrypt) is deliberately slow, so debounce the inputs to
// avoid re-running it on every keystroke; it only fires once typing pauses.
const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<CipherAlgorithm>('AES-GCM');
const cypherSecret = ref('my secret key');
const debouncedCypherInput = refDebounced(cypherInput, 400);
const debouncedCypherSecret = refDebounced(cypherSecret, 400);
const cypherOutput = computed(() =>
  encryptText({ text: debouncedCypherInput.value, secret: debouncedCypherSecret.value, algorithm: cypherAlgo.value }),
);

// The algorithm is stored in the ciphertext envelope, so decryption detects it
// automatically — no algorithm selector needed on this side.
const decryptInput = ref('AQAKbW88xnOVdt19njUE/1/CuIeHo7TM0y3qt6rIxS4pQtqr32+K/sRbv0EUDJQob9plsaiOxoFAvP73loOTTit+HaFTQsvW');
const decryptSecret = ref('my secret key');
const debouncedDecryptInput = refDebounced(decryptInput, 400);
const debouncedDecryptSecret = refDebounced(decryptSecret, 400);
const [decryptOutput, decryptError] = computedCatch(
  () => decryptText({ text: debouncedDecryptInput.value, secret: debouncedDecryptSecret.value }),
  {
    defaultValue: '',
    defaultErrorMessage: t('tools.encryption.unableToDecrypt'),
  },
);
</script>

<template>
  <div mb-2 flex items-start gap-1 text-sm op-70>
    <icon-mdi-shield-lock-outline mt-1 shrink-0 />
    <span>{{ t('tools.encryption.aeadNote') }}</span>
  </div>

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
          :options="cipherAlgorithms.map((label) => ({ label, value: label }))"
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
    <c-input-text
      v-model:value="decryptInput"
      :label="t('tools.encryption.decrypt.textLabel')"
      :placeholder="t('tools.encryption.encrypt.textPlaceholder')"
      rows="4"
      multiline raw-text monospace autosize
    />
    <c-input-text v-model:value="decryptSecret" :label="t('tools.encryption.secretKey')" clearable raw-text mt-3 />

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
