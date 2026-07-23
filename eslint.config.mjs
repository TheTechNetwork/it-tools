import antfu from '@antfu/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';
import unocss from '@unocss/eslint-config/flat';

const compat = new FlatCompat();

export default antfu(
  {
    // Generated declaration files and vendored data are not hand-authored source.
    ignores: ['**/*.d.ts', 'src/tools/bip39-generator/wordlists.ts'],
    vue: true,
    typescript: true,
    jsonc: true,
    stylistic: {
      semi: true,
    },
  },

  // Legacy config for auto-import
  ...compat.config({
    extends: ['./.eslintrc-auto-import.json'],
  }),

  // UnoCSS flat config
  unocss,

  // Custom rules
  {
    rules: {
      'curly': ['error', 'all'],
      '@typescript-eslint/no-use-before-define': ['error', { allowNamedExports: true, functions: false }],
      'no-restricted-imports': ['error', {
        paths: [{
          name: '@vueuse/core',
          importNames: ['useClipboard'],
          message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
        }],
      }],
      // Disable rules that don't align with project practices
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-obscure-range': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'ts/ban-ts-comment': 'off',
      // e18e perf rules introduced by @antfu/eslint-config 7.7.x flag many pre-existing patterns
      'e18e/prefer-static-regex': 'off',
      'e18e/prefer-regex-test': 'off',
      'e18e/prefer-array-at': 'off',
      'e18e/prefer-array-some': 'off',
      'e18e/prefer-date-now': 'off',
    },
  },

  // Vue-specific rules, scoped to .vue files so they don't crash on markdown files
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-empty-component-block': ['error'],
    },
  },

  // Test setup polyfills a Buffer global; the rule's suggested fix
  // (require('buffer')) conflicts with the project's no-require-imports rule.
  {
    files: ['vitest.setup.ts'],
    rules: {
      'node/prefer-global/buffer': 'off',
    },
  },
);
