<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import { convertArrayToCsv } from './json-to-csv.service';

const { t } = useI18n();

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertArrayToCsv({ array: JSON5.parse(value) });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-csv.inputLabel')"
    :input-placeholder="t('tools.json-to-csv.inputPlaceholder')"
    :output-label="t('tools.json-to-csv.outputLabel')"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
