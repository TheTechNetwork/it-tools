import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import markdown from 'unplugin-vue-markdown/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgLoader from 'vite-svg-loader';
import { configDefaults } from 'vitest/config';

const baseUrl = process.env.BASE_URL ?? '/';

// The OCR tool's self-hosted assets live under a path versioned by the
// tesseract.js version, so the engine can never drift from its WASM core.
const tesseractVersion = createRequire(import.meta.url)('tesseract.js/package.json').version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueI18n({
      runtimeOnly: true,
      jitCompilation: true,
      compositionOnly: true,
      fullInstall: true,
      strictMessage: false,
      include: [
        resolve(__dirname, 'locales/**'),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
      viteOptimizeDeps: false,
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    markdown(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        maximumFileSizeToCacheInBytes: 8388608, // 8 MB
      },
      manifest: {
        name: 'IT Tools',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        lang: 'fr-FR',
        start_url: `${baseUrl}?utm_source=pwa&utm_medium=pwa`,
        orientation: 'any',
        theme_color: '#18a058',
        background_color: '#f1f5f9',
        icons: [
          {
            src: '/favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Components({
      dirs: ['src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
      dtsTsx: false,
    }),
    Unocss(),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'buffer': 'buffer',
      'events': 'events',
      'path': 'path-browserify',
      'vm': 'vm-browserify',
    },
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    'import.meta.env.TESSERACT_VERSION': JSON.stringify(tesseractVersion),
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        define: {
          global: 'globalThis',
        },
      },
    },
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    server: {
      deps: {
        // iarna-toml-esm ships ESM files in a CommonJS package, Node cannot
        // load it directly so it must be processed by vite.
        inline: ['iarna-toml-esm'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      // Unit coverage tracks the logic layer (services, composables, utils).
      // Vue SFCs are exercised by the Playwright e2e suite rather than unit
      // tests, so including them would drown this metric in ~0%-covered UI and
      // make it meaningless. They stay out here.
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.e2e.spec.ts',
        'src/**/*.types.ts',
        'src/**/*.d.ts',
        // App wiring, not meaningfully unit-testable
        'src/main.ts',
        'src/plugins/**',
        // Browser/canvas-only PDF rendering (pdf.js), exercised by e2e
        'src/tools/ocr-image-to-text/ocr-image-to-text.pdf.ts',
      ],
      // No-regression floor for the logic layer. Fails CI if coverage drops
      // below these values. autoUpdate ratchets them upward automatically: when
      // a local `pnpm coverage` run measures higher coverage, Vitest rewrites
      // these numbers to the new level (it never lowers them), so improvements
      // get locked in as the new floor. Commit the bumped values.
      thresholds: {
        autoUpdate: true,
        lines: 64.15,
        statements: 64.87,
        functions: 66.35,
        branches: 73.37,
      },
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
