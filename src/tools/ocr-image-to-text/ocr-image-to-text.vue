<script setup lang="ts">
import type { OcrQuality, Recognizer } from './ocr-image-to-text.service';
import { useCopy } from '@/composable/copy';
import { createRecognizer, SUPPORTED_LANGUAGES } from './ocr-image-to-text.service';

const { t } = useI18n();

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
    message.warning(t('tools.ocr-image-to-text.warning.skipped', { n: rejected.length, files: rejected.map(file => file.name).join(', ') }));
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
      return t('tools.ocr-image-to-text.status.processing');
    case 'done':
      return item.text.trim() === '' ? t('tools.ocr-image-to-text.status.noText') : t('tools.ocr-image-to-text.status.characters', { n: item.text.length });
    case 'error':
      return t('tools.ocr-image-to-text.status.error', { error: item.error });
    default:
      return item.kind === 'pdf' ? t('tools.ocr-image-to-text.status.pdfReady') : t('tools.ocr-image-to-text.status.ready');
  }
}

const combinedText = computed(() =>
  items.value
    .filter(item => item.status === 'done' && item.text.trim() !== '')
    .map(item => (items.value.length > 1 ? `===== ${item.file.name} =====\n${item.text}` : item.text))
    .join('\n\n'),
);

const { copy } = useCopy({ source: combinedText, text: t('tools.ocr-image-to-text.copied') });

async function runOcr() {
  if (items.value.length === 0) {
    message.warning(t('tools.ocr-image-to-text.warning.noFiles'));
    return;
  }
  if (selectedLanguages.value.length === 0) {
    message.warning(t('tools.ocr-image-to-text.warning.noLanguage'));
    return;
  }

  isProcessing.value = true;
  progressPercent.value = 0;
  progressLabel.value = t('tools.ocr-image-to-text.progress.loadingEngine');

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
      const position = t('tools.ocr-image-to-text.progress.position', { current: index + 1, total: items.value.length, name: item.file.name });

      try {
        if (item.kind === 'pdf') {
          if (!renderPdfToImages) {
            ({ renderPdfToImages } = await import('./ocr-image-to-text.pdf'));
          }
          progressLabel.value = t('tools.ocr-image-to-text.progress.renderingPdf', { position });
          const pages = await renderPdfToImages(item.file);

          const pageTexts: string[] = [];
          for (const [pageIndex, page] of pages.entries()) {
            progressLabel.value = t('tools.ocr-image-to-text.progress.page', { position, current: pageIndex + 1, total: pages.length });
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
      message.info(t('tools.ocr-image-to-text.info.noTextDetected'));
    }
  }
  catch (error: any) {
    message.error(t('tools.ocr-image-to-text.error.ocrFailed', { error: error?.message ?? error }));
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
    <c-card :title="t('tools.ocr-image-to-text.section.files')">
      <c-file-upload
        multiple
        :accept="ACCEPT"
        :title="t('tools.ocr-image-to-text.upload.title')"
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
            {{ t('tools.ocr-image-to-text.button.clearAll') }}
          </c-button>
        </div>
      </div>
    </c-card>

    <c-card :title="t('tools.ocr-image-to-text.section.options')">
      <n-form-item :label="t('tools.ocr-image-to-text.languages.label')" :show-feedback="false">
        <n-select
          v-model:value="selectedLanguages"
          multiple
          filterable
          :options="languageOptions"
          :placeholder="t('tools.ocr-image-to-text.languages.placeholder')"
        />
      </n-form-item>

      <div mt-3 flex flex-wrap items-center gap-3>
        <span>{{ t('tools.ocr-image-to-text.quality.label') }}</span>
        <n-switch v-model:value="quality" checked-value="best" unchecked-value="fast">
          <template #checked>
            {{ t('tools.ocr-image-to-text.quality.best') }}
          </template>
          <template #unchecked>
            {{ t('tools.ocr-image-to-text.quality.fast') }}
          </template>
        </n-switch>
        <span text-xs op-60>
          {{ t('tools.ocr-image-to-text.quality.hint') }}
        </span>
      </div>

      <div mt-4 flex justify-center>
        <c-button :disabled="items.length === 0 || isProcessing" :loading="isProcessing" @click="runOcr">
          {{ t('tools.ocr-image-to-text.button.extract') }}
        </c-button>
      </div>

      <div v-if="isProcessing" mt-4>
        <div mb-1 text-center op-70>
          {{ progressLabel }}
        </div>
        <n-progress type="line" :percentage="progressPercent" indicator-placement="inside" processing />
      </div>
    </c-card>

    <c-card v-if="combinedText" :title="t('tools.ocr-image-to-text.section.extractedText')">
      <c-input-text
        :value="combinedText"
        multiline
        readonly
        rows="12"
        :placeholder="t('tools.ocr-image-to-text.output.placeholder')"
      />
      <div mt-3 flex justify-center>
        <c-button @click="copy()">
          {{ t('tools.ocr-image-to-text.button.copy') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
