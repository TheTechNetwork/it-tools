<script setup lang="ts">
import type { FileHashAlgorithm } from './file-hash.service';
import InputCopyable from '../../components/InputCopyable.vue';
import { hashFileAll } from './file-hash.service';

const { t } = useI18n();

const file = ref<File | null>(null);
const hashes = ref<Record<FileHashAlgorithm, string> | null>(null);
const progress = ref(0);
const isHashing = ref(false);
const expectedHash = ref('');

async function onFileUpload(uploaded: File) {
  file.value = uploaded;
  hashes.value = null;
  progress.value = 0;
  isHashing.value = true;
  try {
    hashes.value = await hashFileAll({ file: uploaded, onProgress: ratio => (progress.value = ratio) });
  }
  finally {
    isHashing.value = false;
  }
}

// The algorithm whose digest matches the pasted expected hash, if any.
const matchedAlgorithm = computed(() => {
  const needle = expectedHash.value.trim().toLowerCase().replace(/[\s:]/g, '');
  if (needle === '' || !hashes.value) {
    return undefined;
  }
  return (Object.keys(hashes.value) as FileHashAlgorithm[]).find(algo => hashes.value![algo] === needle);
});

const humanFileSize = computed(() => {
  if (!file.value) {
    return '';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = file.value.size;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${unit === 0 ? size : size.toFixed(2)} ${units[unit]}`;
});
</script>

<template>
  <div>
    <c-file-upload
      :title="t('tools.file-hash.dragAndDrop')"
      @file-upload="onFileUpload"
    />

    <c-card v-if="file" mt-4 :title="file.name">
      <div mb-3 text-sm op-70>
        {{ humanFileSize }}
      </div>

      <div v-if="isHashing" my-4 flex flex-col gap-2>
        <span>{{ t('tools.file-hash.hashing') }}</span>
        <n-progress type="line" :percentage="Math.round(progress * 100)" :height="12" />
      </div>

      <div v-if="hashes" flex flex-col gap-2>
        <div v-for="(digest, algo) in hashes" :key="algo">
          <div text-sm op-70>
            {{ algo }}
          </div>
          <InputCopyable :value="digest" readonly />
        </div>
      </div>
    </c-card>

    <c-card v-if="hashes" mt-3 :title="t('tools.file-hash.compareTitle')">
      <c-input-text
        v-model:value="expectedHash"
        :placeholder="t('tools.file-hash.comparePlaceholder')"
        clearable
        monospace
        mb-2
      />
      <n-alert v-if="expectedHash.trim() && matchedAlgorithm" type="success" :bordered="false">
        {{ t('tools.file-hash.matches', { algo: matchedAlgorithm }) }}
      </n-alert>
      <n-alert v-else-if="expectedHash.trim()" type="error" :bordered="false">
        {{ t('tools.file-hash.noMatch') }}
      </n-alert>
    </c-card>
  </div>
</template>
