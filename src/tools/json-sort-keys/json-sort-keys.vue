<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { sortJsonKeys } from './json-sort-keys.service';

const order = ref<'asc' | 'desc'>('asc');

const orderOptions = [
  { label: 'Ascending (A→Z)', value: 'asc' },
  { label: 'Descending (Z→A)', value: 'desc' },
];

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
        label="Key order"
        :options="orderOptions"
        w-56
      />
    </div>

    <format-transformer
      input-label="Your JSON"
      input-placeholder="Paste your JSON here..."
      output-label="JSON with sorted keys"
      output-language="json"
      download-file-name="sorted.json"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
