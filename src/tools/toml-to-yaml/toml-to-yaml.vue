<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from '../toml-to-json/toml-to-json.service';
import { convertTomlToYaml } from './toml-to-yaml.service';

const { t } = useI18n();

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
    :input-label="t('tools.toml-to-yaml.inputLabel')"
    :input-placeholder="t('tools.toml-to-yaml.inputPlaceholder')"
    :output-label="t('tools.toml-to-yaml.outputLabel')"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
