<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import JSON5 from 'json5';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { queryJson } from './jsonpath-query.service';

const { t } = useI18n();

const rawJson = useStorage(
  'jsonpath-query:raw-json',
  '{\n  "store": {\n    "books": [\n      { "title": "Book A", "price": 10 },\n      { "title": "Book B", "price": 25 }\n    ]\n  }\n}',
);
const query = useStorage('jsonpath-query:query', '$.store.books[*].title');

const jsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: (v: string) => v === '' || JSON5.parse(v),
      message: t('tools.jsonpath-query.invalidJson'),
    },
  ],
});

const result = computed(() =>
  withDefaultOnError(() => {
    if (!jsonValidation.isValid) {
      return '';
    }
    return queryJson({ data: rawJson.value, query: query.value });
  }, ''),
);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawJson"
      :label="t('tools.jsonpath-query.inputLabel')"
      :placeholder="t('tools.jsonpath-query.inputPlaceholder')"
      :validation="jsonValidation"
      multiline
      rows="10"
      raw-text
      monospace
      mb-3
    />

    <c-input-text
      v-model:value="query"
      :label="t('tools.jsonpath-query.queryLabel')"
      :placeholder="t('tools.jsonpath-query.queryPlaceholder')"
      raw-text
      monospace
      mb-3
    />

    <n-form-item :label="t('tools.jsonpath-query.resultLabel')" :show-feedback="false">
      <TextareaCopyable :value="result" :word-wrap="true" language="json" />
    </n-form-item>
  </div>
</template>
