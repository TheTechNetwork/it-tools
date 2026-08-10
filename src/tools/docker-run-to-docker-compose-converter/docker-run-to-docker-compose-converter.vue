<script setup lang="ts">
import { MessageType } from '@thetechnetwork/composerize-ts';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { convertDockerRunToDockerCompose, getMessagesOfType } from './docker-run-to-docker-compose-converter.service';

const { t } = useI18n();

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);

const conversionResult = computed(() =>
  withDefaultOnError(() => convertDockerRunToDockerCompose(dockerRun.value), { yaml: '', messages: [] }),
);
const dockerCompose = computed(() => conversionResult.value.yaml);
const notImplemented = computed(() =>
  getMessagesOfType({ messages: conversionResult.value.messages, type: MessageType.notImplemented }),
);
const notComposable = computed(() =>
  getMessagesOfType({ messages: conversionResult.value.messages, type: MessageType.notTranslatable }),
);
const errors = computed(() =>
  getMessagesOfType({ messages: conversionResult.value.messages, type: MessageType.errorDuringConversion }),
);
const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="dockerRun"
      :label="t('tools.docker-run-to-docker-compose-converter.input.label')"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      :placeholder="t('tools.docker-run-to-docker-compose-converter.input.placeholder')"
      rows="3"
    />

    <n-divider />

    <TextareaCopyable :value="dockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        {{ t('tools.docker-run-to-docker-compose-converter.button.download') }}
      </c-button>
    </div>

    <div v-if="notComposable.length > 0">
      <n-alert :title="t('tools.docker-run-to-docker-compose-converter.alert.notComposable')" type="info" mt-5>
        <ul>
          <li v-for="(message, index) of notComposable" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <div v-if="notImplemented.length > 0">
      <n-alert
        :title="t('tools.docker-run-to-docker-compose-converter.alert.notImplemented')"
        type="warning"
        mt-5
      >
        <ul>
          <li v-for="(message, index) of notImplemented" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <div v-if="errors.length > 0">
      <n-alert :title="t('tools.docker-run-to-docker-compose-converter.alert.errors')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
