<script setup lang="ts">
import type { JwtAlgorithm } from './jwt-generator.service';
import { useCopy } from '@/composable/copy';
import { isSymmetric, signJwt, SUPPORTED_ALGORITHMS } from './jwt-generator.service';

const algorithmOptions = SUPPORTED_ALGORITHMS.map(value => ({ label: value, value }));
const algorithm = ref<JwtAlgorithm>('HS256');

const secret = ref('a-string-secret-at-least-256-bits-long');
const privateKey = ref('');

const payload = ref(JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: 1516239022, admin: true }, null, 2));

const symmetric = computed(() => isSymmetric(algorithm.value));
const key = computed(() => (symmetric.value ? secret.value : privateKey.value));

const token = ref('');
const error = ref('');

watchEffect(async () => {
  const currentPayload = payload.value;
  const currentAlgorithm = algorithm.value;
  const currentKey = key.value;

  error.value = '';
  if (currentPayload.trim() === '' || currentKey.trim() === '') {
    token.value = '';
    return;
  }

  try {
    token.value = await signJwt({ payload: currentPayload, algorithm: currentAlgorithm, key: currentKey });
  }
  catch (error_: any) {
    token.value = '';
    error.value = error_.message ?? String(error_);
  }
});

const { copy } = useCopy({ source: token, text: 'Token copied to the clipboard' });
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Options">
      <n-form-item label="Algorithm" :show-feedback="false">
        <n-select v-model:value="algorithm" :options="algorithmOptions" filterable />
      </n-form-item>

      <c-input-text
        v-if="symmetric"
        v-model:value="secret"
        label="Secret"
        placeholder="Your HMAC secret"
        mt-3
      />
      <c-input-text
        v-else
        v-model:value="privateKey"
        label="Private key (PKCS#8, PEM)"
        placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
        multiline
        rows="6"
        monospace
        mt-3
      />
    </c-card>

    <c-card title="Payload">
      <c-input-text
        v-model:value="payload"
        placeholder="The JWT payload as a JSON object"
        multiline
        rows="8"
        monospace
      />
    </c-card>

    <c-card title="Token">
      <n-alert v-if="error" type="error" :show-icon="false">
        {{ error }}
      </n-alert>
      <template v-else>
        <c-input-text
          :value="token"
          readonly
          multiline
          rows="5"
          monospace
          placeholder="The signed JWT will appear here"
        />
        <div mt-3 flex justify-center>
          <c-button :disabled="token === ''" @click="copy()">
            Copy token
          </c-button>
        </div>
      </template>
    </c-card>
  </div>
</template>
