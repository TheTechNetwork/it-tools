<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { evaluateMathExpression } from './math-evaluator.service';

const { t } = useI18n();

const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluateMathExpression(expression.value), ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="expression"
      rows="1"
      multiline
      :placeholder="t('tools.math-evaluator.expressionPlaceholder')"
      raw-text
      monospace
      autofocus
      autosize
    />

    <c-card v-if="result !== ''" :title="t('tools.math-evaluator.result')" mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
