<script setup lang="ts">
import type { SortOrder } from './text-line-tools.service';
import { useCopy } from '@/composable/copy';
import { applyLineOperations } from './text-line-tools.service';

const { t } = useI18n();

const input = ref('');

const trim = ref(false);
const removeEmpty = ref(false);
const unique = ref(false);
const sort = ref<SortOrder>('none');
const reverse = ref(false);
const number = ref(false);

const sortOptions = computed(() => [
  { label: t('tools.text-line-tools.sort.none'), value: 'none' },
  { label: t('tools.text-line-tools.sort.asc'), value: 'asc' },
  { label: t('tools.text-line-tools.sort.desc'), value: 'desc' },
  { label: t('tools.text-line-tools.sort.shuffle'), value: 'shuffle' },
]);

const output = computed(() =>
  applyLineOperations(input.value, {
    trim: trim.value,
    removeEmpty: removeEmpty.value,
    unique: unique.value,
    sort: sort.value,
    reverse: reverse.value,
    number: number.value,
  }),
);

const { copy } = useCopy({ source: output, text: t('tools.text-line-tools.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :label="t('tools.text-line-tools.input.label')"
      :placeholder="t('tools.text-line-tools.input.placeholder')"
      multiline
      rows="8"
      raw-text
      monospace
    />

    <c-card :title="t('tools.text-line-tools.operations.title')" mt-4>
      <div flex flex-wrap gap-x-6 gap-y-3>
        <n-checkbox v-model:checked="trim">
          {{ t('tools.text-line-tools.operations.trim') }}
        </n-checkbox>
        <n-checkbox v-model:checked="removeEmpty">
          {{ t('tools.text-line-tools.operations.removeEmpty') }}
        </n-checkbox>
        <n-checkbox v-model:checked="unique">
          {{ t('tools.text-line-tools.operations.unique') }}
        </n-checkbox>
        <n-checkbox v-model:checked="reverse">
          {{ t('tools.text-line-tools.operations.reverse') }}
        </n-checkbox>
        <n-checkbox v-model:checked="number">
          {{ t('tools.text-line-tools.operations.number') }}
        </n-checkbox>
      </div>

      <c-select
        v-model:value="sort"
        :label="t('tools.text-line-tools.sort.label')"
        :options="sortOptions"
        mt-3
      />
    </c-card>

    <c-input-text
      :value="output"
      :label="t('tools.text-line-tools.output.label')"
      :placeholder="t('tools.text-line-tools.output.placeholder')"
      multiline
      rows="8"
      readonly
      raw-text
      monospace
      mt-4
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="output === ''" @click="copy()">
        {{ t('tools.text-line-tools.button.copy') }}
      </c-button>
    </div>
  </div>
</template>
