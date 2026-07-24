<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { convertJsonToTypescript } from './json-to-typescript.service';

const transformer = (value: string) => withDefaultOnError(() => convertJsonToTypescript(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => convertJsonToTypescript(value)),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="TypeScript interfaces"
    output-language="typescript"
    download-file-name="types.ts"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
