<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import {
  toCamelCase,
  toCapitalCase,
  toConstantCase,
  toDotCase,
  toKebabCase,
  toLowerCase,
  toMockingCase,
  toNoCase,
  toPascalCase,
  toPascalSnakeCase,
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toTrainCase,
  toUpperCase,
} from './case-converter.service';

const { t } = useI18n();

const input = ref('lorem ipsum dolor sit amet');

const formats = computed(() => [
  {
    label: t('tools.case-converter.lowercase'),
    value: toLowerCase(input.value),
  },
  {
    label: t('tools.case-converter.uppercase'),
    value: toUpperCase(input.value),
  },
  {
    label: t('tools.case-converter.camelcase'),
    value: toCamelCase(input.value),
  },
  {
    label: t('tools.case-converter.capitalcase'),
    value: toCapitalCase(input.value),
  },
  {
    label: t('tools.case-converter.constantcase'),
    value: toConstantCase(input.value),
  },
  {
    label: t('tools.case-converter.dotcase'),
    value: toDotCase(input.value),
  },
  {
    label: t('tools.case-converter.traincase'),
    value: toTrainCase(input.value),
  },
  {
    label: t('tools.case-converter.nocase'),
    value: toNoCase(input.value),
  },
  {
    label: t('tools.case-converter.kebabcase'),
    value: toKebabCase(input.value),
  },
  {
    label: t('tools.case-converter.pascalcase'),
    value: toPascalCase(input.value),
  },
  {
    label: t('tools.case-converter.pascalsnakecase'),
    value: toPascalSnakeCase(input.value),
  },
  {
    label: t('tools.case-converter.pathcase'),
    value: toPathCase(input.value),
  },
  {
    label: t('tools.case-converter.sentencecase'),
    value: toSentenceCase(input.value),
  },
  {
    label: t('tools.case-converter.snakecase'),
    value: toSnakeCase(input.value),
  },
  {
    label: t('tools.case-converter.mockingcase'),
    value: toMockingCase(input.value),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
} as const;
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      :label="t('tools.case-converter.yourString')"
      :placeholder="t('tools.case-converter.placeholder')"
      raw-text
      v-bind="inputLabelAlignmentConfig"
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />
  </c-card>
</template>
