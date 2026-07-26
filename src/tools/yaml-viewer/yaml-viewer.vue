<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import yaml from 'yaml';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { formatYaml } from './yaml-viewer.service';

const { t } = useI18n();

const inputElement = ref<HTMLElement>();

const rawYaml = useStorage('yaml-prettify:raw-yaml', '');
const indentSize = useStorage('yaml-prettify:indent-size', 2);
const sortKeys = useStorage('yaml-prettify:sort-keys', false);

const cleanYaml = computed(() =>
  withDefaultOnError(() => formatYaml({ rawYaml: rawYaml.value, indentSize: indentSize.value, sortKeys: sortKeys.value }), ''),
);

const rawYamlValidation = useValidation({
  source: rawYaml,
  rules: [
    {
      validator: (v: string) => v === '' || yaml.parse(v),
      message: t('tools.yaml-prettify.validation.invalid'),
    },
  ],
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <n-form-item :label="t('tools.yaml-prettify.sortKeys')" label-placement="left" label-width="100">
        <n-switch v-model:value="sortKeys" />
      </n-form-item>
      <n-form-item :label="t('tools.yaml-prettify.indentSize')" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="1" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <n-form-item
    :label="t('tools.yaml-prettify.rawYamlLabel')"
    :feedback="rawYamlValidation.message"
    :validation-status="rawYamlValidation.status"
  >
    <c-input-text
      ref="inputElement"
      v-model:value="rawYaml"
      :placeholder="t('tools.yaml-prettify.rawYamlPlaceholder')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>
  <n-form-item :label="t('tools.yaml-prettify.prettifiedLabel')">
    <TextareaCopyable :value="cleanYaml" language="yaml" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
