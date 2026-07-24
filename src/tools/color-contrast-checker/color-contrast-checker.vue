<script setup lang="ts">
import { getContrastRatio, getWcagCompliance, isValidColor } from './color-contrast-checker.service';

const foreground = ref('#333333');
const background = ref('#ffffff');

const foregroundValid = computed(() => isValidColor(foreground.value));
const backgroundValid = computed(() => isValidColor(background.value));
const bothValid = computed(() => foregroundValid.value && backgroundValid.value);

const ratio = computed(() => (bothValid.value ? getContrastRatio(foreground.value, background.value) : 0));
const ratioLabel = computed(() => `${ratio.value.toFixed(2)}:1`);
const compliance = computed(() => getWcagCompliance(ratio.value));

const results = computed(() => [
  { label: 'Normal text', aa: compliance.value.normalAa, aaa: compliance.value.normalAaa },
  { label: 'Large text', aa: compliance.value.largeAa, aaa: compliance.value.largeAaa },
]);
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Colors">
      <div flex flex-wrap gap-4>
        <n-form-item label="Text color" :show-feedback="false" flex-1>
          <div flex flex-1 items-center gap-2>
            <n-color-picker v-model:value="foreground" :show-alpha="false" flex-1 />
            <c-input-text v-model:value="foreground" :validation-rules="[]" monospace w-32 />
          </div>
        </n-form-item>

        <n-form-item label="Background color" :show-feedback="false" flex-1>
          <div flex flex-1 items-center gap-2>
            <n-color-picker v-model:value="background" :show-alpha="false" flex-1 />
            <c-input-text v-model:value="background" monospace w-32 />
          </div>
        </n-form-item>
      </div>

      <n-alert v-if="!bothValid" type="error" mt-2 :show-icon="false">
        Please enter two valid CSS colors.
      </n-alert>
    </c-card>

    <c-card title="Preview">
      <div
        class="preview"
        :style="{ color: foreground, backgroundColor: background }"
      >
        <p class="preview-large">
          Large text — the quick brown fox
        </p>
        <p class="preview-normal">
          Normal text — the quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </c-card>

    <c-card title="Contrast ratio">
      <div flex flex-col items-center gap-1>
        <div text-4xl font-bold>
          {{ ratioLabel }}
        </div>
        <div op-70>
          WCAG 2.1 contrast ratio (1:1 to 21:1)
        </div>
      </div>

      <n-table mt-4 :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>Content</th>
            <th text-center>
              AA
            </th>
            <th text-center>
              AAA
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results" :key="row.label">
            <td>{{ row.label }}</td>
            <td text-center>
              <n-tag :type="row.aa ? 'success' : 'error'" :bordered="false">
                {{ row.aa ? 'Pass' : 'Fail' }}
              </n-tag>
            </td>
            <td text-center>
              <n-tag :type="row.aaa ? 'success' : 'error'" :bordered="false">
                {{ row.aaa ? 'Pass' : 'Fail' }}
              </n-tag>
            </td>
          </tr>
        </tbody>
      </n-table>

      <div mt-2 text-sm op-70>
        Large text is 18pt (24px) or 14pt (18.66px) bold and above.
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.preview {
  padding: 24px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.3);

  .preview-large {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 12px;
  }

  .preview-normal {
    font-size: 16px;
    margin: 0;
  }
}
</style>
