import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';

import shadow from 'vue-shadow-dom';
import App from './App.vue';
import { i18nPlugin } from './plugins/i18n.plugin';

import { naive } from './plugins/naive.plugin';

import router from './router';

// Installs `global`/`process` shims that browserified deps (e.g.
// crypto-browserify via bcryptjs) reference at chunk-eval time. This runs
// during main.ts evaluation — before the app mounts and before any lazily
// loaded tool chunk can evaluate — which is all that is required.
import './polyfills/node-globals';
import 'virtual:uno.css';

registerSW();

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(shadow);

app.mount('#app');
