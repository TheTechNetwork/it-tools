<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import _ from 'lodash';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string;
    inputValidationRules?: UseValidationRule<string>[];
    inputLabel?: string;
    inputPlaceholder?: string;
    inputDefault?: string;
    outputLabel?: string;
    outputLanguage?: string;
    showImport?: boolean;
    showDownload?: boolean;
    downloadFileName?: string;
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: 'Input',
    inputDefault: '',
    inputPlaceholder: 'Input...',
    outputLabel: 'Output',
    outputLanguage: '',
    showImport: true,
    showDownload: true,
    downloadFileName: 'output.txt',
  },
);

const {
  transformer,
  inputValidationRules,
  inputLabel,
  outputLabel,
  outputLanguage,
  inputPlaceholder,
  inputDefault,
  showImport,
  showDownload,
  downloadFileName,
} = toRefs(props);

const inputElement = ref<typeof CInputText>();

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));

const fileInput = ref<HTMLInputElement>();

function triggerImport() {
  fileInput.value?.click();
}

async function onFileImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    input.value = await file.text();
  }
  // Reset so importing the same file again re-triggers change.
  target.value = '';
}

function downloadOutput() {
  const blob = new Blob([output.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = downloadFileName.value;
  anchor.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <div v-if="showImport" mb-2 flex justify-end>
      <input ref="fileInput" type="file" class="hidden" @change="onFileImport">
      <c-button size="small" @click="triggerImport">
        Import file
      </c-button>
    </div>

    <CInputText
      ref="inputElement"
      v-model:value="input"
      :placeholder="inputPlaceholder"
      :label="inputLabel"
      rows="20"
      autosize
      raw-text
      multiline
      test-id="input"
      :validation-rules="inputValidationRules"
      monospace
    />
  </div>

  <div overflow-auto>
    <div mb-5px flex items-center justify-between gap-2>
      <span>{{ outputLabel }}</span>
      <c-button v-if="showDownload" size="small" :disabled="output === ''" @click="downloadOutput">
        Download
      </c-button>
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />
  </div>
</template>
