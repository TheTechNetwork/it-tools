<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { normalizeEmails } from './email-normalizer.service';

const { t } = useI18n();

const emails = ref('');
const normalizedEmails = computed(() => normalizeEmails(emails.value));

const { copy } = useCopy({ source: normalizedEmails, text: t('tools.email-normalizer.copied'), createToast: true });
</script>

<template>
  <div>
    <div class="mb-2">
      {{ t('tools.email-normalizer.rawLabel') }}
    </div>
    <c-input-text
      v-model:value="emails"
      :placeholder="t('tools.email-normalizer.rawPlaceholder')"
      rows="3"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      autofocus
      monospace
    />

    <div class="mb-2 mt-4">
      {{ t('tools.email-normalizer.normalizedLabel') }}
    </div>
    <c-input-text
      :value="normalizedEmails"
      :placeholder="t('tools.email-normalizer.normalizedPlaceholder')"
      rows="3"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      multiline
      readonly
      monospace
    />
    <div class="mt-4 flex justify-center gap-2">
      <c-button @click="emails = ''">
        {{ t('tools.email-normalizer.clear') }}
      </c-button>
      <c-button :disabled="!normalizedEmails" @click="copy()">
        {{ t('tools.email-normalizer.copyButton') }}
      </c-button>
    </div>
  </div>
</template>
