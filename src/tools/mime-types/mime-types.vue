<script setup lang="ts">
import {
  getExtensionsFromMimeType,
  getExtensionToMimeTypeOptions,
  getMimeInfos,
  getMimeTypeFromExtension,
  getMimeTypeToExtensionOptions,
} from './mime-types.service';

const { t } = useI18n();

const mimeInfos = getMimeInfos();

const mimeToExtensionsOptions = getMimeTypeToExtensionOptions();
const selectedMimeType = ref(undefined);

const extensionsFound = computed(() => (selectedMimeType.value ? getExtensionsFromMimeType(selectedMimeType.value) : []));

const extensionToMimeTypeOptions = getExtensionToMimeTypeOptions();
const selectedExtension = ref(undefined);

const mimeTypeFound = computed(() => (selectedExtension.value ? getMimeTypeFromExtension(selectedExtension.value) : []));
</script>

<template>
  <c-card>
    <n-h2 style="margin-bottom: 0">
      {{ t('tools.mime-types.mimeToExtensionTitle') }}
    </n-h2>
    <div style="opacity: 0.8">
      {{ t('tools.mime-types.mimeToExtensionDescription') }}
    </div>
    <c-select
      v-model:value="selectedMimeType"
      searchable
      my-4
      :options="mimeToExtensionsOptions"
      :placeholder="t('tools.mime-types.mimeTypePlaceholder')"
    />

    <div v-if="extensionsFound.length > 0">
      {{ t('tools.mime-types.extensionsOfFiles') }} <n-tag round :bordered="false">
        {{ selectedMimeType }}
      </n-tag> {{ t('tools.mime-types.mimeTypeSuffix') }}
      <div style="margin-top: 10px">
        <n-tag
          v-for="extension of extensionsFound"
          :key="extension"
          round
          :bordered="false"
          type="primary"
          style="margin-right: 10px"
        >
          .{{ extension }}
        </n-tag>
      </div>
    </div>
  </c-card>

  <c-card>
    <n-h2 style="margin-bottom: 0">
      {{ t('tools.mime-types.extensionToMimeTitle') }}
    </n-h2>
    <div style="opacity: 0.8">
      {{ t('tools.mime-types.extensionToMimeDescription') }}
    </div>
    <c-select
      v-model:value="selectedExtension"
      searchable
      my-4
      :options="extensionToMimeTypeOptions"
      :placeholder="t('tools.mime-types.mimeTypePlaceholder')"
    />

    <div v-if="selectedExtension">
      {{ t('tools.mime-types.mimeTypeAssociated') }} <n-tag round :bordered="false">
        {{ selectedExtension }}
      </n-tag> {{ t('tools.mime-types.fileExtensionSuffix') }}
      <div style="margin-top: 10px">
        <n-tag round :bordered="false" type="primary" style="margin-right: 10px">
          {{ mimeTypeFound }}
        </n-tag>
      </div>
    </div>
  </c-card>

  <div>
    <n-table>
      <thead>
        <tr>
          <th>{{ t('tools.mime-types.mimeTypesColumn') }}</th>
          <th>{{ t('tools.mime-types.extensionsColumn') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ mimeType, extensions } of mimeInfos" :key="mimeType">
          <td>{{ mimeType }}</td>
          <td>
            <n-tag v-for="extension of extensions" :key="extension" round :bordered="false" style="margin-right: 10px">
              .{{ extension }}
            </n-tag>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
