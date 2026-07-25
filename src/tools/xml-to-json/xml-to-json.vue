<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { convertXmlToJson } from './xml-to-json.service';

const { t } = useI18n();

const defaultValue = '<a x="1.234" y="It\'s"/>';
function transformer(value: string) {
  return withDefaultOnError(() => convertXmlToJson(value), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: 'Provided XML is not valid.',
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.xml-to-json.inputLabel')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.xml-to-json.inputPlaceholder')"
    :output-label="t('tools.xml-to-json.outputLabel')"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
