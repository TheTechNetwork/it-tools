<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import { minifyJson } from './json-minify.service';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => minifyJson(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your raw JSON"
    :input-default="defaultValue"
    input-placeholder="Paste your raw JSON here..."
    output-label="Minified version of your JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
