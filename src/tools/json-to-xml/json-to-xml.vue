<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import { convertJsonToXml } from './json-to-xml.service';

const { t } = useI18n();

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
function transformer(value: string) {
  return withDefaultOnError(() => convertJsonToXml(value), '');
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
    :input-label="t('tools.json-to-xml.inputLabel')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-xml.inputPlaceholder')"
    :output-label="t('tools.json-to-xml.outputLabel')"
    output-language="xml"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
