<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { evaluateMathExpression } from './math-evaluator.service';

const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluateMathExpression(expression.value), ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="expression"
      rows="1"
      multiline
      placeholder="Your math expression (ex: 2*sqrt(6) )..."
      raw-text
      monospace
      autofocus
      autosize
    />

    <c-card v-if="result !== ''" title="Result " mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
