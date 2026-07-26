<script setup lang="ts">
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';
import { generateUla } from './ipv6-ula-generator.service';

const { t } = useI18n();

const macAddress = ref('20:37:06:12:34:56');
const calculatedSections = computed(() => {
  const { ula, firstRoutableBlock, lastRoutableBlock } = generateUla({
    macAddress: macAddress.value,
    timestamp: new Date().getTime(),
  });

  return [
    {
      label: t('tools.ipv6-ula-generator.result.ula'),
      value: ula,
    },
    {
      label: t('tools.ipv6-ula-generator.result.firstBlock'),
      value: firstRoutableBlock,
    },
    {
      label: t('tools.ipv6-ula-generator.result.lastBlock'),
      value: lastRoutableBlock,
    },
  ];
});

const addressValidation = macAddressValidation(macAddress);
</script>

<template>
  <div>
    <n-alert :title="t('tools.ipv6-ula-generator.alert.title')" type="info">
      {{ t('tools.ipv6-ula-generator.alert.text') }}
    </n-alert>

    <c-input-text
      v-model:value="macAddress"
      :placeholder="t('tools.ipv6-ula-generator.macAddress.placeholder')"
      clearable
      :label="t('tools.ipv6-ula-generator.macAddress.label')"
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
