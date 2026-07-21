<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import { convertYamlToToml } from './yaml-to-toml.service';

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your YAML"
    input-placeholder="Paste your YAML here..."
    output-label="TOML from your YAML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
