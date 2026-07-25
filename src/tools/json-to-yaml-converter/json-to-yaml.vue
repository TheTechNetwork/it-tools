<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { convertJsonToYaml } from './json-to-yaml.service';

const { t } = useI18n();

const transformer = (value: string) => withDefaultOnError(() => convertJsonToYaml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => convertJsonToYaml(value)),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-yaml-converter.inputLabel')"
    :input-placeholder="t('tools.json-to-yaml-converter.inputPlaceholder')"
    :output-label="t('tools.json-to-yaml-converter.outputLabel')"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
