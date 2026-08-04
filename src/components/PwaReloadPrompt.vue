<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useAppTheme } from '@/ui/theme/themes';

// Service-worker registration + update handling. With `registerType: 'prompt'`
// (vite.config.ts) a freshly built service worker waits instead of reloading
// silently; `needRefresh` flips when one is ready, and we surface a banner so
// the user chooses when to reload (calling updateServiceWorker skips waiting
// and reloads). `offlineReady` fires once, the first time the app is cached.
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const theme = useAppTheme();

const show = computed(() => needRefresh.value || offlineReady.value);

function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}
</script>

<template>
  <Transition name="pwa-toast">
    <div v-if="show" class="pwa-toast" role="alert" aria-live="polite">
      <span class="pwa-toast__message">
        {{ needRefresh ? $t('pwa.newContent') : $t('pwa.offlineReady') }}
      </span>

      <div class="pwa-toast__actions">
        <c-button v-if="needRefresh" type="primary" size="small" @click="updateServiceWorker()">
          {{ $t('pwa.reload') }}
        </c-button>
        <c-button size="small" @click="close">
          {{ $t('pwa.dismiss') }}
        </c-button>
      </div>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.pwa-toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid v-bind('theme.default.colorPressed');
  background-color: v-bind('theme.background');
  color: v-bind('theme.text.baseColor');
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
}

.pwa-toast__message {
  font-size: 14px;
  line-height: 1.4;
}

.pwa-toast__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.pwa-toast-enter-active,
.pwa-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.pwa-toast-enter-from,
.pwa-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
