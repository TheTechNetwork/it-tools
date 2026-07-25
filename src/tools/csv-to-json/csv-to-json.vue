<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { convertCsvToJson } from './csv-to-json.service';

const { t } = useI18n();

const delimiter = ref(',');
const useHeader = ref(true);

const transformer = computed(() => (value: string) =>
  withDefaultOnError(() => convertCsvToJson(value, { delimiter: delimiter.value || ',', header: useHeader.value }), ''),
);

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: (value: string) =>
      value === '' || isNotThrowing(() => convertCsvToJson(value, { delimiter: delimiter.value || ',', header: useHeader.value })),
    message: 'Provided CSV is not valid.',
  },
]);
</script>

<template>
  <div>
    <div mb-2 flex flex-wrap items-center gap-4>
      <c-input-text
        v-model:value="delimiter"
        :label="t('tools.csv-to-json.delimiter')"
        :placeholder="t('tools.csv-to-json.delimiterPlaceholder')"
        w-24
      />
      <n-form-item :label="t('tools.csv-to-json.header')" :show-feedback="false" label-placement="left">
        <n-switch v-model:value="useHeader" />
      </n-form-item>
    </div>

    <format-transformer
      :input-label="t('tools.csv-to-json.inputLabel')"
      :input-placeholder="t('tools.csv-to-json.inputPlaceholder')"
      :output-label="t('tools.csv-to-json.outputLabel')"
      output-language="json"
      download-file-name="data.json"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
