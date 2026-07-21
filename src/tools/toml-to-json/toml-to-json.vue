<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '../../utils/defaults';
import { convertTomlToJson, isValidToml } from './toml-to-json.service';

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
    input-label="Your TOML"
    input-placeholder="Paste your TOML here..."
    output-label="JSON from your TOML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
