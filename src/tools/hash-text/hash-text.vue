<script setup lang="ts">
import type { Encoding } from './hash-text.service';
import { keccak_512, md5, ripemd160, sha1, sha224, sha256, sha384, sha512 } from '@awasm/noble';
import { utf8ToBytes } from '@awasm/noble/utils.js';

import { useQueryParam } from '@/composable/queryParams';
import InputCopyable from '../../components/InputCopyable.vue';
import { formatBytes } from './hash-text.service';

const { t } = useI18n();

const algos = {
  MD5: md5,
  SHA1: sha1,
  SHA256: sha256,
  SHA224: sha224,
  SHA512: sha512,
  SHA384: sha384,
  // crypto-js's "SHA3" was actually Keccak (the pre-NIST padding); keccak_512
  // reproduces the exact output the tool has always shown for the "SHA3" row.
  SHA3: keccak_512,
  RIPEMD160: ripemd160,
} as const;

type AlgoNames = keyof typeof algos;
const algoNames = Object.keys(algos) as AlgoNames[];
const encoding = useQueryParam<Encoding>({ defaultValue: 'Hex', name: 'encoding' });
const clearText = ref('');

const hashText = (algo: AlgoNames, value: string) => formatBytes(algos[algo](utf8ToBytes(value)), encoding.value);
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="clearText" multiline raw-text :placeholder="t('tools.hash-text.textPlaceholder')" rows="3" autosize autofocus :label="t('tools.hash-text.textLabel')" />

      <n-divider />

      <c-select
        v-model:value="encoding"
        mb-4
        :label="t('tools.hash-text.digestEncoding')"
        :options="[
          {
            label: t('tools.hash-text.encoding.binary'),
            value: 'Bin',
          },
          {
            label: t('tools.hash-text.encoding.hexadecimal'),
            value: 'Hex',
          },
          {
            label: t('tools.hash-text.encoding.base64'),
            value: 'Base64',
          },
          {
            label: t('tools.hash-text.encoding.base64url'),
            value: 'Base64url',
          },
        ]"
      />

      <div v-for="algo in algoNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            {{ algo }}
          </n-input-group-label>
          <InputCopyable :value="hashText(algo, clearText)" readonly />
        </n-input-group>
      </div>
    </c-card>
  </div>
</template>
