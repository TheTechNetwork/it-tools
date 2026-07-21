<script setup lang="ts">
import { MessageType } from 'composerize-ts';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { convertDockerRunToDockerCompose, getMessagesOfType } from './docker-run-to-docker-compose-converter.service';

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
      label="Your docker run command:"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      placeholder="Your docker run command to convert..."
      rows="3"
    />

    <n-divider />

    <TextareaCopyable :value="dockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        Download docker-compose.yml
      </c-button>
    </div>

    <div v-if="notComposable.length > 0">
      <n-alert title="This options are not translatable to docker-compose" type="info" mt-5>
        <ul>
          <li v-for="(message, index) of notComposable" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <div v-if="notImplemented.length > 0">
      <n-alert
        title="This options are not yet implemented and therefore haven't been translated to docker-compose"
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
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
