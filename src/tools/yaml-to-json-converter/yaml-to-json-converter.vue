<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { parse as parseYaml } from 'yaml';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { convertYamlToJson } from './yaml-to-json-converter.service';

const { t } = useI18n();

function transformer(value: string) {
  return withDefaultOnError(() => convertYamlToJson(value), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: 'Provided YAML is not valid.',
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.yaml-to-json-converter.inputLabel')"
    :input-placeholder="t('tools.yaml-to-json-converter.inputPlaceholder')"
    :output-label="t('tools.yaml-to-json-converter.outputLabel')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
