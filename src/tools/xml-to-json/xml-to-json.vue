<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { convertXmlToJson } from './xml-to-json.service';

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
    input-label="Your XML content"
    :input-default="defaultValue"
    input-placeholder="Paste your XML content here..."
    output-label="Converted JSON"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
