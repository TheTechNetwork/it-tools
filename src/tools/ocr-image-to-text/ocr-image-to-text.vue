<script setup lang="ts">
import type { OcrQuality, Recognizer } from './ocr-image-to-text.service';
import { useCopy } from '@/composable/copy';
import { createRecognizer, SUPPORTED_LANGUAGES } from './ocr-image-to-text.service';

interface UploadItem {
  id: string;
  file: File;
  kind: 'image' | 'pdf';
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  text: string;
  error: string;
}

const message = useMessage();

const ACCEPT = 'image/*,application/pdf';

const languageOptions = SUPPORTED_LANGUAGES.map(({ code, name }) => ({ label: name, value: code }));
const selectedLanguages = ref<string[]>(['eng']);
const quality = ref<OcrQuality>('fast');

const items = ref<UploadItem[]>([]);

const isProcessing = ref(false);
const progressLabel = ref('');
const progressPercent = ref(0);

let idCounter = 0;

function isAllowed(file: File): boolean {
  return file.type.startsWith('image/') || file.type === 'application/pdf';
}

function onFilesUpload(files: File[]) {
  const rejected = files.filter(file => !isAllowed(file));
  if (rejected.length > 0) {
    message.warning(`Skipped ${rejected.length} unsupported file(s): ${rejected.map(file => file.name).join(', ')}`);
  }

  for (const file of files.filter(isAllowed)) {
    const kind = file.type === 'application/pdf' ? 'pdf' : 'image';
    items.value.push({
      id: `f${idCounter++}`,
      file,
      kind,
      previewUrl: kind === 'image' ? URL.createObjectURL(file) : '',
      status: 'pending',
      text: '',
      error: '',
    });
  }
}

function removeItem(id: string) {
  const index = items.value.findIndex(item => item.id === id);
  if (index >= 0) {
    const [removed] = items.value.splice(index, 1);
    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }
  }
}

function clearAll() {
  for (const item of items.value) {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  }
  items.value = [];
}

function statusLabel(item: UploadItem): string {
  switch (item.status) {
    case 'processing':
      return 'Processing…';
    case 'done':
      return item.text.trim() === '' ? 'No text detected' : `${item.text.length} characters`;
    case 'error':
      return `Error: ${item.error}`;
    default:
      return item.kind === 'pdf' ? 'PDF · ready' : 'Ready';
  }
}

const combinedText = computed(() =>
  items.value
    .filter(item => item.status === 'done' && item.text.trim() !== '')
    .map(item => (items.value.length > 1 ? `===== ${item.file.name} =====\n${item.text}` : item.text))
    .join('\n\n'),
);

const { copy } = useCopy({ source: combinedText, text: 'Extracted text copied to the clipboard' });

async function runOcr() {
  if (items.value.length === 0) {
    message.warning('Please add at least one image or PDF');
    return;
  }
  if (selectedLanguages.value.length === 0) {
    message.warning('Please select at least one language');
    return;
  }

  isProcessing.value = true;
  progressPercent.value = 0;
  progressLabel.value = 'Loading OCR engine…';

  let recognizer: Recognizer | undefined;
  let renderPdfToImages: (typeof import('./ocr-image-to-text.pdf'))['renderPdfToImages'] | undefined;

  try {
    recognizer = await createRecognizer({
      languages: selectedLanguages.value,
      quality: quality.value,
      onProgress: ({ status, progress }) => {
        progressLabel.value = status;
        progressPercent.value = Math.round(progress * 100);
      },
    });

    for (const [index, item] of items.value.entries()) {
      item.status = 'processing';
      item.text = '';
      item.error = '';
      const position = `File ${index + 1}/${items.value.length} · ${item.file.name}`;

      try {
        if (item.kind === 'pdf') {
          if (!renderPdfToImages) {
            ({ renderPdfToImages } = await import('./ocr-image-to-text.pdf'));
          }
          progressLabel.value = `${position} · rendering PDF…`;
          const pages = await renderPdfToImages(item.file);

          const pageTexts: string[] = [];
          for (const [pageIndex, page] of pages.entries()) {
            progressLabel.value = `${position} · page ${pageIndex + 1}/${pages.length}`;
            pageTexts.push(await recognizer.recognize(page));
          }
          item.text = pages.length > 1
            ? pageTexts.map((text, pageIndex) => `--- page ${pageIndex + 1} ---\n${text}`).join('\n\n')
            : (pageTexts[0] ?? '');
        }
        else {
          progressLabel.value = position;
          item.text = await recognizer.recognize(item.file);
        }
        item.status = 'done';
      }
      catch (error: any) {
        item.status = 'error';
        item.error = error?.message ?? String(error);
      }
    }

    if (combinedText.value.trim() === '' && items.value.every(item => item.status === 'done')) {
      message.info('No text was detected');
    }
  }
  catch (error: any) {
    message.error(`OCR failed: ${error?.message ?? error}`);
  }
  finally {
    await recognizer?.terminate();
    isProcessing.value = false;
    progressLabel.value = '';
  }
}

onBeforeUnmount(clearAll);
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Files">
      <c-file-upload
        multiple
        :accept="ACCEPT"
        title="Drag and drop images or PDFs here, or click to select"
        @files-upload="onFilesUpload"
      />

      <div v-if="items.length > 0" mt-4 flex flex-col gap-2>
        <div
          v-for="item in items"
          :key="item.id"
          flex items-center gap-3 border border-gray-400 border-op-30 rounded p-2
        >
          <img
            v-if="item.kind === 'image'"
            :src="item.previewUrl"
            alt=""
            style="height: 40px; width: 40px; object-fit: cover"
            rounded
          >
          <div
            v-else
            style="height: 40px; width: 40px"
            flex items-center justify-center rounded bg-gray-400 bg-op-10 text-xs font-bold
          >
            PDF
          </div>

          <div flex-1 truncate>
            <div truncate>
              {{ item.file.name }}
            </div>
            <div text-xs op-60>
              {{ statusLabel(item) }}
            </div>
          </div>

          <c-button circle variant="text" :disabled="isProcessing" @click="removeItem(item.id)">
            ✕
          </c-button>
        </div>

        <div flex justify-end>
          <c-button variant="text" :disabled="isProcessing" @click="clearAll">
            Clear all
          </c-button>
        </div>
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

      <div mt-3 flex flex-wrap items-center gap-3>
        <span>Quality</span>
        <n-switch v-model:value="quality" checked-value="best" unchecked-value="fast">
          <template #checked>
            Best
          </template>
          <template #unchecked>
            Fast
          </template>
        </n-switch>
        <span text-xs op-60>
          Best is more accurate but slower and downloads larger language data.
        </span>
      </div>

      <div mt-4 flex justify-center>
        <c-button :disabled="items.length === 0 || isProcessing" :loading="isProcessing" @click="runOcr">
          Extract text
        </c-button>
      </div>

      <div v-if="isProcessing" mt-4>
        <div mb-1 text-center op-70>
          {{ progressLabel }}
        </div>
        <n-progress type="line" :percentage="progressPercent" indicator-placement="inside" processing />
      </div>
    </c-card>

    <c-card v-if="combinedText" title="Extracted text">
      <c-input-text
        :value="combinedText"
        multiline
        readonly
        rows="12"
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
