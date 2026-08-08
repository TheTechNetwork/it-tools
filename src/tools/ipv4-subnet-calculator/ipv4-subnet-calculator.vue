<script setup lang="ts">
import type { Netmask } from 'netmask';
import { IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from '@tabler/icons-vue';
import { useStorage } from '@vueuse/core';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { getIPClass } from './ipv4-subnet-calculator.models';
import { getNetworkInfo, getNetworkMaskInBinary } from './ipv4-subnet-calculator.service';

const { t } = useI18n();

const ip = useStorage('ipv4-subnet-calculator:ip', '192.168.0.1/24');

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = [
  {
    message: t('tools.ipv4-subnet-calculator.cannotParse'),
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value.trim())),
  },
];

const sections = computed<{
  label: string;
  getValue: (blocks: Netmask) => string | undefined;
  undefinedFallback?: string;
}[]>(() => [
  {
    label: t('tools.ipv4-subnet-calculator.sections.netmask'),
    getValue: block => block.toString(),
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.networkAddress'),
    getValue: ({ base }) => base,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.networkMask'),
    getValue: ({ mask }) => mask,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.networkMaskBinary'),
    getValue: ({ bitmask }) => getNetworkMaskInBinary({ bitmask }),
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.cidrNotation'),
    getValue: ({ bitmask }) => `/${bitmask}`,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.wildcardMask'),
    getValue: ({ hostmask }) => hostmask,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.networkSize'),
    getValue: ({ size }) => String(size),
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.firstAddress'),
    getValue: ({ first }) => first,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.lastAddress'),
    getValue: ({ last }) => last,
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.broadcastAddress'),
    getValue: ({ broadcast }) => broadcast,
    undefinedFallback: t('tools.ipv4-subnet-calculator.noBroadcast'),
  },
  {
    label: t('tools.ipv4-subnet-calculator.sections.ipClass'),
    getValue: ({ base: ip }) => getIPClass({ ip }),
    undefinedFallback: t('tools.ipv4-subnet-calculator.unknownClass'),
  },
]);

function switchToBlock({ count = 1 }: { count?: number }) {
  const next = networkInfo.value?.next(count);

  if (next) {
    ip.value = next.toString();
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ip"
      :label="t('tools.ipv4-subnet-calculator.inputLabel')"
      :placeholder="t('tools.ipv4-subnet-calculator.inputPlaceholder')"
      :validation-rules="ipValidationRules"
      mb-4
    />

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td font-bold>
              {{ label }}
            </td>
            <td>
              <SpanCopyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)" />
              <span v-else op-70>
                {{ undefinedFallback }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>

      <div mt-3 flex items-center justify-between>
        <c-button @click="switchToBlock({ count: -1 })">
          <n-icon :component="ArrowLeft" />
          {{ t('tools.ipv4-subnet-calculator.previousBlock') }}
        </c-button>
        <c-button @click="switchToBlock({ count: 1 })">
          {{ t('tools.ipv4-subnet-calculator.nextBlock') }}
          <n-icon :component="ArrowRight" />
        </c-button>
      </div>
    </div>
  </div>
</template>
