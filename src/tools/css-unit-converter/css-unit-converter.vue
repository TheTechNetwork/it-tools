<script setup lang="ts">
import type { CssUnit } from './css-unit-converter.service';
import { convertCssUnit, CSS_UNITS } from './css-unit-converter.service';

const { t } = useI18n();

const unitOptions = CSS_UNITS.map(({ value, label }) => ({ value, label }));

const inputValue = ref(16);
const fromUnit = ref<CssUnit>('px');
const toUnit = ref<CssUnit>('rem');
const baseFontSize = ref(16);

const result = computed(() => {
  const converted = convertCssUnit({
    value: inputValue.value,
    from: fromUnit.value,
    to: toUnit.value,
    baseFontSize: baseFontSize.value,
  });

  if (!Number.isFinite(converted)) {
    return '';
  }

  // Trim trailing zeros while keeping precision for very small/large results.
  return Number.parseFloat(converted.toPrecision(12)).toString();
});

function swap() {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
}
</script>

<template>
  <c-card>
    <div flex flex-col gap-3>
      <n-form-item :label="t('tools.css-unit-converter.valueToConvert')" :show-feedback="false">
        <n-input-number v-model:value="inputValue" w-full />
      </n-form-item>

      <div flex flex-wrap items-end gap-3>
        <c-select
          v-model:value="fromUnit"
          :label="t('tools.css-unit-converter.from')"
          :options="unitOptions"
          searchable
          flex-1
        />

        <c-button circle mb-1 :title="t('tools.css-unit-converter.swap')" @click="swap">
          ⇄
        </c-button>

        <c-select
          v-model:value="toUnit"
          :label="t('tools.css-unit-converter.to')"
          :options="unitOptions"
          searchable
          flex-1
        />
      </div>

      <n-form-item :label="t('tools.css-unit-converter.baseFontSize')" :show-feedback="false">
        <n-input-number v-model:value="baseFontSize" w-full :min="1" />
      </n-form-item>

      <c-input-text
        :label="t('tools.css-unit-converter.result')"
        :value="result"
        readonly
        monospace
        mt-2
      />
    </div>
  </c-card>
</template>
