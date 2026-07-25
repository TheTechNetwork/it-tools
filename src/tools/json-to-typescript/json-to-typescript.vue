<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { convertJsonToTypescript } from './json-to-typescript.service';

const { t } = useI18n();

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
    :input-label="t('tools.json-to-typescript.inputLabel')"
    :input-placeholder="t('tools.json-to-typescript.inputPlaceholder')"
    :output-label="t('tools.json-to-typescript.outputLabel')"
    output-language="typescript"
    download-file-name="types.ts"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
