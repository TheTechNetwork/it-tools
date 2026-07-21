<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from '../toml-to-json/toml-to-json.service';
import { convertTomlToYaml } from './toml-to-yaml.service';

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertTomlToYaml(value), '');

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
    output-label="YAML from your TOML"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
