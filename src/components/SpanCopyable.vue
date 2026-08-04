<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' });
const { value } = toRefs(props);

const initialText = 'Copy to clipboard';

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? 'Copied!' : initialText);
</script>

<template>
  <c-tooltip :tooltip="tooltipText">
    <span
      cursor-pointer
      font-mono
      role="button"
      tabindex="0"
      :aria-label="`${initialText}: ${value}`"
      @click="copy()"
      @keydown.enter.prevent="copy()"
      @keydown.space.prevent="copy()"
    >{{ value }}</span>
  </c-tooltip>
</template>
