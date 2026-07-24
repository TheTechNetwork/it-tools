<script setup lang="ts">
import type { SortOrder } from './text-line-tools.service';
import { useCopy } from '@/composable/copy';
import { applyLineOperations } from './text-line-tools.service';

const input = ref('');

const trim = ref(false);
const removeEmpty = ref(false);
const unique = ref(false);
const sort = ref<SortOrder>('none');
const reverse = ref(false);
const number = ref(false);

const sortOptions = [
  { label: 'No sorting', value: 'none' },
  { label: 'Ascending (A→Z)', value: 'asc' },
  { label: 'Descending (Z→A)', value: 'desc' },
  { label: 'Shuffle', value: 'shuffle' },
];

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

const { copy } = useCopy({ source: output, text: 'Result copied to the clipboard' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      label="Your text"
      placeholder="Paste your lines of text here..."
      multiline
      rows="8"
      raw-text
      monospace
    />

    <c-card title="Operations" mt-4>
      <div flex flex-wrap gap-x-6 gap-y-3>
        <n-checkbox v-model:checked="trim">
          Trim each line
        </n-checkbox>
        <n-checkbox v-model:checked="removeEmpty">
          Remove empty lines
        </n-checkbox>
        <n-checkbox v-model:checked="unique">
          Remove duplicates
        </n-checkbox>
        <n-checkbox v-model:checked="reverse">
          Reverse order
        </n-checkbox>
        <n-checkbox v-model:checked="number">
          Number lines
        </n-checkbox>
      </div>

      <c-select
        v-model:value="sort"
        label="Sort"
        :options="sortOptions"
        mt-3
      />
    </c-card>

    <c-input-text
      :value="output"
      label="Result"
      placeholder="The transformed lines will appear here..."
      multiline
      rows="8"
      readonly
      raw-text
      monospace
      mt-4
    />

    <div mt-4 flex justify-center>
      <c-button :disabled="output === ''" @click="copy()">
        Copy result
      </c-button>
    </div>
  </div>
</template>
