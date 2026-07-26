<script setup lang="ts">
import { convertDuration, DURATION_UNITS, humanizeDuration } from './duration-converter.service';

const { t } = useI18n();

const unitOptions = DURATION_UNITS.map(({ key, label }) => ({ label, value: key }));

const inputValue = ref(3661);
const fromUnit = ref('second');
const toUnit = ref('minute');

const result = computed(() => {
  const converted = convertDuration({ value: inputValue.value, from: fromUnit.value, to: toUnit.value });
  return Number.parseFloat(converted.toPrecision(15)).toString();
});

const humanized = computed(() => humanizeDuration({ value: inputValue.value, from: fromUnit.value }));

function swap() {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
}
</script>

<template>
  <c-card>
    <div flex flex-col gap-3>
      <n-form-item :label="t('tools.duration-converter.durationLabel')" :show-feedback="false">
        <n-input-number v-model:value="inputValue" w-full />
      </n-form-item>

      <div flex flex-wrap items-end gap-3>
        <c-select
          v-model:value="fromUnit"
          :label="t('tools.duration-converter.fromLabel')"
          :options="unitOptions"

          searchable flex-1
        />

        <c-button circle mb-1 @click="swap">
          ⇄
        </c-button>

        <c-select
          v-model:value="toUnit"
          :label="t('tools.duration-converter.toLabel')"
          :options="unitOptions"

          searchable flex-1
        />
      </div>

      <c-input-text
        :label="t('tools.duration-converter.resultLabel')"
        :value="result"
        readonly
        monospace
        mt-2
      />

      <c-input-text
        :label="t('tools.duration-converter.humanReadableLabel')"
        :value="humanized"
        readonly
      />
    </div>
  </c-card>
</template>
