<script setup lang="ts">
import type { UserAgentResultSection } from './user-agent-parser.types';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import { withDefaultOnError } from '@/utils/defaults';
import { getUserAgentInfo } from './user-agent-parser.service';
import UserAgentResultCards from './user-agent-result-cards.vue';

const { t } = useI18n();

const ua = ref(navigator.userAgent as string);

const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections = computed<UserAgentResultSection[]>(() => [
  {
    heading: t('tools.user-agent-parser.sections.browser'),
    icon: Browser,
    content: [
      {
        label: t('tools.user-agent-parser.labels.name'),
        getValue: block => block?.browser.name,
        undefinedFallback: t('tools.user-agent-parser.fallback.browserName'),
      },
      {
        label: t('tools.user-agent-parser.labels.version'),
        getValue: block => block?.browser.version,
        undefinedFallback: t('tools.user-agent-parser.fallback.browserVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.engine'),
    icon: Engine,
    content: [
      {
        label: t('tools.user-agent-parser.labels.name'),
        getValue: block => block?.engine.name,
        undefinedFallback: t('tools.user-agent-parser.fallback.engineName'),
      },
      {
        label: t('tools.user-agent-parser.labels.version'),
        getValue: block => block?.engine.version,
        undefinedFallback: t('tools.user-agent-parser.fallback.engineVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.os'),
    icon: Adjustments,
    content: [
      {
        label: t('tools.user-agent-parser.labels.name'),
        getValue: block => block?.os.name,
        undefinedFallback: t('tools.user-agent-parser.fallback.osName'),
      },
      {
        label: t('tools.user-agent-parser.labels.version'),
        getValue: block => block?.os.version,
        undefinedFallback: t('tools.user-agent-parser.fallback.osVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.device'),
    icon: Devices,
    content: [
      {
        label: t('tools.user-agent-parser.labels.model'),
        getValue: block => block?.device.model,
        undefinedFallback: t('tools.user-agent-parser.fallback.deviceModel'),
      },
      {
        label: t('tools.user-agent-parser.labels.type'),
        getValue: block => block?.device.type,
        undefinedFallback: t('tools.user-agent-parser.fallback.deviceType'),
      },
      {
        label: t('tools.user-agent-parser.labels.vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: t('tools.user-agent-parser.fallback.deviceVendor'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.cpu'),
    icon: Cpu,
    content: [
      {
        label: t('tools.user-agent-parser.labels.architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: t('tools.user-agent-parser.fallback.cpuArchitecture'),
      },
    ],
  },
]);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      :label="t('tools.user-agent-parser.uaLabel')"
      multiline
      :placeholder="t('tools.user-agent-parser.uaPlaceholder')"
      clearable
      raw-text
      rows="2"
      autosize
      monospace
      mb-3
    />

    <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>
