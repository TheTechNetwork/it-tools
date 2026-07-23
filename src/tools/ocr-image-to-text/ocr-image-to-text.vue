<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { recognizeText, SUPPORTED_LANGUAGES } from './ocr-image-to-text.service';

const message = useMessage();

const languageOptions = SUPPORTED_LANGUAGES.map(({ code, name }) => ({ label: name, value: code }));
const selectedLanguages = ref<string[]>(['eng']);

const imageFile = ref<File | null>(null);
const imagePreview = ref<string>('');

const isProcessing = ref(false);
const progressStatus = ref('');
const progressPercent = ref(0);

const extractedText = ref('');
const { copy } = useCopy({ source: extractedText, text: 'Extracted text copied to the clipboard' });

function onFileUpload(file: File) {
  imageFile.value = file;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = URL.createObjectURL(file);
  extractedText.value = '';
}

async function runOcr() {
  if (!imageFile.value) {
    message.warning('Please select an image first');
    return;
  }
  if (selectedLanguages.value.length === 0) {
    message.warning('Please select at least one language');
    return;
  }

  isProcessing.value = true;
  progressPercent.value = 0;
  progressStatus.value = 'Starting…';
  extractedText.value = '';

  try {
    extractedText.value = await recognizeText({
      image: imageFile.value,
      languages: selectedLanguages.value,
      onProgress: ({ status, progress }) => {
        progressStatus.value = status;
        progressPercent.value = Math.round(progress * 100);
      },
    });
    if (extractedText.value.trim() === '') {
      message.info('No text was detected in the image');
    }
  }
  catch (error: any) {
    message.error(`OCR failed: ${error.message ?? error}`);
  }
  finally {
    isProcessing.value = false;
  }
}

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
});
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Image">
      <c-file-upload accept="image/*" title="Drag and drop an image here, or click to select" @file-upload="onFileUpload" />

      <div v-if="imagePreview" mt-4 flex justify-center>
        <img :src="imagePreview" alt="Selected image preview" style="max-height: 300px; max-width: 100%;" rounded>
      </div>
    </c-card>

    <c-card title="Options">
      <n-form-item label="Languages" :show-feedback="false">
        <n-select
          v-model:value="selectedLanguages"
          multiple
          filterable
          :options="languageOptions"
          placeholder="Select one or more languages"
        />
      </n-form-item>

      <div mt-4 flex justify-center>
        <c-button :disabled="!imageFile || isProcessing" :loading="isProcessing" @click="runOcr">
          Extract text
        </c-button>
      </div>

      <div v-if="isProcessing" mt-4>
        <div mb-1 text-center op-70>
          {{ progressStatus }}
        </div>
        <n-progress type="line" :percentage="progressPercent" indicator-placement="inside" processing />
      </div>
    </c-card>

    <c-card v-if="extractedText" title="Extracted text">
      <c-input-text
        :value="extractedText"
        multiline
        readonly
        rows="10"
        placeholder="The extracted text will appear here"
      />
      <div mt-3 flex justify-center>
        <c-button @click="copy()">
          Copy text
        </c-button>
      </div>
    </c-card>
  </div>
</template>
