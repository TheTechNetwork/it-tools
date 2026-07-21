<script setup lang="ts">
import {
  getExtensionsFromMimeType,
  getExtensionToMimeTypeOptions,
  getMimeInfos,
  getMimeTypeFromExtension,
  getMimeTypeToExtensionOptions,
} from './mime-types.service';

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
      Mime type to extension
    </n-h2>
    <div style="opacity: 0.8">
      Know which file extensions are associated to a mime-type
    </div>
    <c-select
      v-model:value="selectedMimeType"
      searchable
      my-4
      :options="mimeToExtensionsOptions"
      placeholder="Select your mimetype here... (ex: application/pdf)"
    />

    <div v-if="extensionsFound.length > 0">
      Extensions of files with the <n-tag round :bordered="false">
        {{ selectedMimeType }}
      </n-tag> mime-type:
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
      File extension to mime type
    </n-h2>
    <div style="opacity: 0.8">
      Know which mime type is associated to a file extension
    </div>
    <c-select
      v-model:value="selectedExtension"
      searchable
      my-4
      :options="extensionToMimeTypeOptions"
      placeholder="Select your mimetype here... (ex: application/pdf)"
    />

    <div v-if="selectedExtension">
      Mime type associated to the extension <n-tag round :bordered="false">
        {{ selectedExtension }}
      </n-tag> file
      extension:
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
          <th>Mime types</th>
          <th>Extensions</th>
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
