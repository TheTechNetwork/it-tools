<script setup lang="ts">
import { convertDataSize, DATA_UNITS } from './data-storage-converter.service';

const unitOptions = DATA_UNITS.map(({ key, label }) => ({ label, value: key }));

const inputValue = ref(1);
const fromUnit = ref('megabyte');
const toUnit = ref('mebibyte');

const result = computed(() => {
  const converted = convertDataSize({ value: inputValue.value, from: fromUnit.value, to: toUnit.value });
  // Trim trailing zeros while keeping precision for very small/large results.
  return Number.parseFloat(converted.toPrecision(15)).toString();
});

function swap() {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
}
</script>

<template>
  <c-card>
    <div flex flex-col gap-3>
      <n-form-item label="Value to convert" :show-feedback="false">
        <n-input-number v-model:value="inputValue" w-full :min="0" />
      </n-form-item>

      <div flex flex-wrap items-end gap-3>
        <c-select
          v-model:value="fromUnit"
          label="From"
          :options="unitOptions"

          searchable flex-1
        />

        <c-button circle mb-1 @click="swap">
          ⇄
        </c-button>

        <c-select
          v-model:value="toUnit"
          label="To"
          :options="unitOptions"

          searchable flex-1
        />
      </div>

      <c-input-text
        label="Result"
        :value="result"
        readonly
        monospace
        mt-2
      />
    </div>
  </c-card>
</template>
