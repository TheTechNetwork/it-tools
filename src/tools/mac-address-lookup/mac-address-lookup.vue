<script setup lang="ts">
import type { OuiData } from './mac-address-lookup.service';
import { useCopy } from '@/composable/copy';
import { macAddressValidationRules } from '@/utils/macAddress';
import { loadOuiData, lookupMacAddressVendor } from './mac-address-lookup.service';

const { t } = useI18n();

const macAddress = ref('20:37:06:12:34:56');

const ouiData = ref<OuiData>();
loadOuiData().then((db) => {
  ouiData.value = db;
});

const loading = computed(() => ouiData.value === undefined);
const details = computed<string | undefined>(() =>
  ouiData.value ? lookupMacAddressVendor(ouiData.value, macAddress.value) : undefined,
);

const { copy } = useCopy({ source: () => details.value ?? '', text: t('tools.mac-address-lookup.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      :label="t('tools.mac-address-lookup.macAddress.label')"
      size="large"
      :placeholder="t('tools.mac-address-lookup.macAddress.placeholder')"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      {{ t('tools.mac-address-lookup.vendorInfo') }}
    </div>
    <c-card mb-5>
      <div v-if="loading" italic op-60>
        {{ t('tools.mac-address-lookup.loading') }}
      </div>
      <div v-else-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        {{ t('tools.mac-address-lookup.unknownVendor') }}
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        {{ t('tools.mac-address-lookup.button.copy') }}
      </c-button>
    </div>
  </div>
</template>
