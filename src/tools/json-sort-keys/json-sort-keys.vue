<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { sortJsonKeys } from './json-sort-keys.service';

const { t } = useI18n();

const order = ref<'asc' | 'desc'>('asc');

const orderOptions = computed(() => [
  { label: t('tools.json-sort-keys.ascending'), value: 'asc' },
  { label: t('tools.json-sort-keys.descending'), value: 'desc' },
]);

const transformer = computed(() => (value: string) =>
  withDefaultOnError(() => sortJsonKeys(value, { order: order.value }), ''),
);

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => sortJsonKeys(value, { order: order.value })),
    message: 'Provided JSON is not valid.',
  },
]);
</script>

<template>
  <div>
    <div mb-2 flex justify-end>
      <c-select
        v-model:value="order"
        :label="t('tools.json-sort-keys.keyOrder')"
        :options="orderOptions"
        w-56
      />
    </div>

    <format-transformer
      :input-label="t('tools.json-sort-keys.inputLabel')"
      :input-placeholder="t('tools.json-sort-keys.inputPlaceholder')"
      :output-label="t('tools.json-sort-keys.outputLabel')"
      output-language="json"
      download-file-name="sorted.json"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
