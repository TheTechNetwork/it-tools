import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
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

// The ascii-text-drawer tool loads figlet font definitions from the unpkg CDN at
// runtime. Pin the URL to the installed figlet version so the fetched fonts never
// drift from the bundled figlet engine (and so the CSP allowance stays exact).
// figlet's package.json is not exposed via its `exports` map, so resolve the
// package root from its entrypoint and read the version from there.
const figletVersion = (() => {
  let dir = dirname(createRequire(import.meta.url).resolve('figlet'));
  for (let depth = 0; depth < 6; depth++) {
    try {
      const pkg = JSON.parse(readFileSync(resolve(dir, 'package.json'), 'utf8'));
      if (pkg.name === 'figlet') {
        return pkg.version as string;
      }
    }
    catch {
      // keep walking up until a figlet package.json is found
    }
    dir = dirname(dir);
  }
  throw new Error('Could not resolve the installed figlet version');
})();

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
      // 'prompt' lets a new service worker wait until the user chooses to
      // reload (surfaced by <PwaReloadPrompt />), instead of silently
      // auto-reloading - so an in-progress tool session is never interrupted.
      registerType: 'prompt',
      strategies: 'generateSW',
      workbox: {
        maximumFileSizeToCacheInBytes: 8388608, // 8 MB
        // The first-party asset host serves version-pinned, immutable assets
        // (OCR Tesseract engine/traineddata under /tesseract/, figlet fonts
        // under /figlet/). CacheFirst lets them work offline after first use and
        // avoids re-downloading them on every visit. They are not precached
        // (they are large and only some tools need them); this caches on demand.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/assets\.thetech\.network\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'thetech-first-party-assets',
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        id: baseUrl,
        name: 'IT Tools',
        short_name: 'IT Tools',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        lang: 'en',
        dir: 'ltr',
        categories: ['utilities', 'productivity', 'developer'],
        start_url: baseUrl,
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
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
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
    'import.meta.env.FIGLET_VERSION': JSON.stringify(figletVersion),
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
        'src/router.ts',
        'src/config.ts',
        'src/themes.ts',
        'src/plugins/**',
        // Tool definitions (defineTool metadata) and barrel/registry index
        // files: declarations with no branches or logic to unit-test.
        'src/**/index.ts',
        // Browser-only Node global shims (global/process); the guarded branches
        // never execute under Node/jsdom where those globals already exist.
        'src/polyfills/**',
        // Browser-only Monaco web-worker wiring (sets self.MonacoEnvironment and
        // instantiates a Worker); not meaningfully unit-testable, exercised by
        // the text-diff e2e.
        'src/ui/c-diff-editor/monaco-environment.ts',
        // Browser/canvas-only PDF rendering (pdf.js), exercised by e2e
        'src/tools/ocr-image-to-text/ocr-image-to-text.pdf.ts',
        // Trivial browser Map-method shim for pdf.js (branch depends on the
        // runtime), loaded by the pdf module and exercised by e2e
        'src/tools/ocr-image-to-text/map-upsert.polyfill.ts',
      ],
      // No-regression floor for the logic layer. Fails CI if coverage drops
      // below these values. autoUpdate ratchets them upward automatically: when
      // a local `pnpm coverage` run measures higher coverage, Vitest rewrites
      // these numbers to the new level (it never lowers them), so improvements
      // get locked in as the new floor. Commit the bumped values.
      thresholds: {
        autoUpdate: true,
        lines: 97.76,
        statements: 97.78,
        functions: 99.01,
        branches: 96.48,
      },
    },
  },
  build: {
    target: 'esnext',
    // The heaviest tools (Monaco, OCR/tesseract, mathjs) are each isolated into
    // their own lazily-loaded chunk, so large-chunk warnings for them are
    // expected and not actionable. Raise the limit above their known size to
    // keep the build output free of noise.
    chunkSizeWarningLimit: 900,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Split the large, eager framework vendors into their own stable chunks
        // so they stay cached across app releases (they change far less often
        // than tool code). Only naive-ui and the Vue runtime are grouped - both
        // load on every page. Heavy tool-only libraries (Monaco, tesseract.js,
        // mathjs, pdfjs, figlet, ...) are intentionally NOT grouped here so they
        // remain in their own lazily-loaded per-tool chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('naive-ui') || id.includes('/css-render/') || id.includes('/@css-render/')
            || id.includes('/vooks/') || id.includes('/vdirs/') || id.includes('/seemly/')
            || id.includes('/treemate/') || id.includes('/evtd/')) {
            return 'vendor-naive-ui';
          }
          if (id.includes('/vue/') || id.includes('/@vue/') || id.includes('/vue-router/')
            || id.includes('/pinia/') || id.includes('/@vueuse/') || id.includes('/vue-i18n/')
            || id.includes('/@intlify/')) {
            return 'vendor-vue';
          }
          return undefined;
        },
      },
    },
  },
});
