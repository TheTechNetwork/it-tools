import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import unocss from '@unocss/eslint-config/flat'

const compat = new FlatCompat()

export default antfu(
  {
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
      'vue/no-empty-component-block': ['error'],
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
    },
  },
)
