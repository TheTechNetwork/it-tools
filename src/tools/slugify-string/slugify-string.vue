<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { slugifyString } from './slugify-string.service';

const { t } = useI18n();

const input = ref('');
const separator = ref('-');
const lowercase = ref(true);

const slug = computed(() =>
  withDefaultOnError(() => slugifyString(input.value, { separator: separator.value, lowercase: lowercase.value }), ''),
);
const { copy } = useCopy({ source: slug, text: t('tools.slugify-string.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      multiline
      :placeholder="t('tools.slugify-string.stringPlaceholder')"
      :label="t('tools.slugify-string.yourString')"
      autofocus
      raw-text
      mb-5
    />

    <div mb-5 flex flex-wrap items-center gap-4>
      <c-input-text
        v-model:value="separator"
        :label="t('tools.slugify-string.separator')"
        label-position="left"
        raw-text
        w-40
      />
      <n-form-item :label="t('tools.slugify-string.lowercase')" :show-feedback="false" label-placement="left">
        <n-switch v-model:value="lowercase" />
      </n-form-item>
    </div>

    <c-input-text
      :value="slug"
      multiline
      readonly
      :placeholder="t('tools.slugify-string.slugPlaceholder')"
      :label="t('tools.slugify-string.yourSlug')"
      mb-5
    />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        {{ t('tools.slugify-string.copySlug') }}
      </c-button>
    </div>
  </div>
</template>
