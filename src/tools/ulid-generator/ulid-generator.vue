<script setup lang="ts">
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { generateUlids } from './ulid-generator.service';

const { t } = useI18n();

const amount = useStorage('ulid-generator-amount', 1);
const formats = computed(() => [
  { label: t('tools.ulid-generator.formats.raw'), value: 'raw' as const },
  { label: t('tools.ulid-generator.formats.json'), value: 'json' as const },
]);
const format = useStorage<'raw' | 'json'>('ulid-generator-format', 'raw');

const [ulids, refreshUlids] = computedRefreshable(() => generateUlids({ amount: amount.value, format: format.value }));

const { copy } = useCopy({ source: ulids, text: t('tools.ulid-generator.copied') });
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-75px> {{ t('tools.ulid-generator.quantity') }}</label>
      <n-input-number v-model:value="amount" min="1" max="100" flex-1 />
    </div>

    <c-buttons-select v-model:value="format" :options="formats" :label="t('tools.ulid-generator.format')" label-width="75px" />

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ ulids }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshUlids()">
        {{ t('tools.ulid-generator.refresh') }}
      </c-button>
      <c-button @click="copy()">
        {{ t('tools.ulid-generator.copy') }}
      </c-button>
    </div>
  </div>
</template>
