<script setup lang="ts">
import type { OuiData } from './mac-address-lookup.service';
import { useCopy } from '@/composable/copy';
import { macAddressValidationRules } from '@/utils/macAddress';
import { loadOuiData, lookupMacAddressVendor } from './mac-address-lookup.service';

const macAddress = ref('20:37:06:12:34:56');

const ouiData = ref<OuiData>();
loadOuiData().then((db) => {
  ouiData.value = db;
});

const loading = computed(() => ouiData.value === undefined);
const details = computed<string | undefined>(() =>
  ouiData.value ? lookupMacAddressVendor(ouiData.value, macAddress.value) : undefined,
);

const { copy } = useCopy({ source: () => details.value ?? '', text: 'Vendor info copied to the clipboard' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      label="MAC address:"
      size="large"
      placeholder="Type a MAC address"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      Vendor info:
    </div>
    <c-card mb-5>
      <div v-if="loading" italic op-60>
        Loading vendor database…
      </div>
      <div v-else-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        Unknown vendor for this address
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        Copy vendor info
      </c-button>
    </div>
  </div>
</template>
