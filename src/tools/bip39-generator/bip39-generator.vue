<script setup lang="ts">
import { Copy, Refresh } from '@vicons/tabler';

import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import {
  convertEntropyToMnemonic,
  convertMnemonicToEntropy,
  generateRandomEntropy,
  isEntropyHexadecimal,
  isEntropyLengthValid,
  languages,
} from './bip39-generator.service';

const entropy = ref(generateRandomEntropy());
const passphraseInput = ref('');

const language = ref<keyof typeof languages>('English');
const passphrase = computed({
  get() {
    return withDefaultOnError(
      () => convertEntropyToMnemonic({ entropy: entropy.value, language: language.value }),
      passphraseInput.value,
    );
  },
  set(value: string) {
    passphraseInput.value = value;
    entropy.value = withDefaultOnError(() => convertMnemonicToEntropy({ mnemonic: value, language: language.value }), '');
  },
});

const entropyValidation = useValidation({
  source: entropy,
  rules: [
    {
      validator: (value: string) => isEntropyLengthValid(value),
      message: 'Entropy length should be >= 16, <= 32 and be a multiple of 4',
    },
    {
      validator: (value: string) => isEntropyHexadecimal(value),
      message: 'Entropy should be an hexadecimal string',
    },
  ],
});

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: [
    {
      validator: (value: string) =>
        isNotThrowing(() => convertMnemonicToEntropy({ mnemonic: value, language: language.value })),
      message: 'Invalid mnemonic',
    },
  ],
});

function refreshEntropy() {
  entropy.value = generateRandomEntropy();
}

const { copy: copyEntropy } = useCopy({ source: entropy, text: 'Entropy copied to the clipboard' });
const { copy: copyPassphrase } = useCopy({ source: passphrase, text: 'Passphrase copied to the clipboard' });
</script>

<template>
  <div>
    <n-grid cols="3" x-gap="12">
      <n-gi span="1">
        <c-select
          v-model:value="language"
          searchable
          label="Language:"
          :options="Object.keys(languages)"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item
          label="Entropy (seed):"
          :feedback="entropyValidation.message"
          :validation-status="entropyValidation.status"
        >
          <n-input-group>
            <c-input-text v-model:value="entropy" placeholder="Your string..." />

            <c-button @click="refreshEntropy()">
              <n-icon size="22">
                <Refresh />
              </n-icon>
            </c-button>
            <c-button @click="copyEntropy()">
              <n-icon size="22">
                <Copy />
              </n-icon>
            </c-button>
          </n-input-group>
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-form-item
      label="Passphrase (mnemonic):"
      :feedback="mnemonicValidation.message"
      :validation-status="mnemonicValidation.status"
    >
      <n-input-group>
        <c-input-text v-model:value="passphrase" placeholder="Your mnemonic..." raw-text />

        <c-button @click="copyPassphrase()">
          <n-icon size="22" :component="Copy" />
        </c-button>
      </n-input-group>
    </n-form-item>
  </div>
</template>
