<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '../../utils/defaults';
import { convertTomlToJson, isValidToml } from './toml-to-json.service';

const { t } = useI18n();

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => convertTomlToJson(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: 'Provided TOML is not valid.',
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.toml-to-json.inputLabel')"
    :input-placeholder="t('tools.toml-to-json.inputPlaceholder')"
    :output-label="t('tools.toml-to-json.outputLabel')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
