<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';
import { compareStringWithHash, hashString } from './bcrypt.service';

const { t } = useI18n();

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashString({ string: input.value, saltCount: saltCount.value }));
const { copy } = useCopy({ source: hashed, text: t('tools.bcrypt.copied') });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareStringWithHash({ string: compareString.value, hash: compareHash.value }));
</script>

<template>
  <c-card :title="t('tools.bcrypt.hash.title')">
    <c-input-text
      v-model:value="input"
      :placeholder="t('tools.bcrypt.hash.stringPlaceholder')"
      raw-text
      :label="t('tools.bcrypt.hash.stringLabel')"
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item :label="t('tools.bcrypt.hash.saltCount')" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" :placeholder="t('tools.bcrypt.hash.saltCountPlaceholder')" :max="100" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        {{ t('tools.bcrypt.hash.copyHash') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.bcrypt.compare.title')">
    <n-form label-width="120">
      <n-form-item :label="t('tools.bcrypt.compare.stringLabel')" label-placement="left">
        <c-input-text v-model:value="compareString" :placeholder="t('tools.bcrypt.compare.stringPlaceholder')" raw-text />
      </n-form-item>
      <n-form-item :label="t('tools.bcrypt.compare.hashLabel')" label-placement="left">
        <c-input-text v-model:value="compareHash" :placeholder="t('tools.bcrypt.compare.hashPlaceholder')" raw-text />
      </n-form-item>
      <n-form-item :label="t('tools.bcrypt.compare.doTheyMatch')" label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? t('tools.bcrypt.compare.matchYes') : t('tools.bcrypt.compare.matchNo') }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
