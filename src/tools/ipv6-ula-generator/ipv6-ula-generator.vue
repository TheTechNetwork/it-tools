<script setup lang="ts">
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';
import { generateUla } from './ipv6-ula-generator.service';

const macAddress = ref('20:37:06:12:34:56');
const calculatedSections = computed(() => {
  const { ula, firstRoutableBlock, lastRoutableBlock } = generateUla({
    macAddress: macAddress.value,
    timestamp: new Date().getTime(),
  });

  return [
    {
      label: 'IPv6 ULA:',
      value: ula,
    },
    {
      label: 'First routable block:',
      value: firstRoutableBlock,
    },
    {
      label: 'Last routable block:',
      value: lastRoutableBlock,
    },
  ];
});

const addressValidation = macAddressValidation(macAddress);
</script>

<template>
  <div>
    <n-alert title="Info" type="info">
      This tool uses the first method suggested by IETF using the current timestamp plus the mac address, sha1 hashed,
      and the lower 40 bits to generate your random ULA.
    </n-alert>

    <c-input-text
      v-model:value="macAddress"
      placeholder="Type a MAC address"
      clearable
      label="MAC address:"
      raw-text
      my-8
      :validation="addressValidation"
    />

    <div v-if="addressValidation.isValid">
      <InputCopyable
        v-for="{ label, value } in calculatedSections"
        :key="label"
        :value="value"
        :label="label"
        label-width="160px"
        label-align="right"
        label-position="left"
        readonly
        mb-2
      />
    </div>
  </div>
</template>
