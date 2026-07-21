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
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toTrainCase,
  toUpperCase,
} from './case-converter.service';

const input = ref('lorem ipsum dolor sit amet');

const formats = computed(() => [
  {
    label: 'Lowercase:',
    value: toLowerCase(input.value),
  },
  {
    label: 'Uppercase:',
    value: toUpperCase(input.value),
  },
  {
    label: 'Camelcase:',
    value: toCamelCase(input.value),
  },
  {
    label: 'Capitalcase:',
    value: toCapitalCase(input.value),
  },
  {
    label: 'Constantcase:',
    value: toConstantCase(input.value),
  },
  {
    label: 'Dotcase:',
    value: toDotCase(input.value),
  },
  {
    label: 'Traincase:',
    value: toTrainCase(input.value),
  },
  {
    label: 'Nocase:',
    value: toNoCase(input.value),
  },
  {
    label: 'Kebabcase:',
    value: toKebabCase(input.value),
  },
  {
    label: 'Pascalcase:',
    value: toPascalCase(input.value),
  },
  {
    label: 'Pathcase:',
    value: toPathCase(input.value),
  },
  {
    label: 'Sentencecase:',
    value: toSentenceCase(input.value),
  },
  {
    label: 'Snakecase:',
    value: toSnakeCase(input.value),
  },
  {
    label: 'Mockingcase:',
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
      label="Your string:"
      placeholder="Your string..."
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
