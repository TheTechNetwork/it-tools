# IT-Tools - AI Assistant Documentation

This document provides comprehensive guidance for AI assistants working with the IT-Tools codebase. It covers project structure, development workflows, conventions, and best practices.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Workflows](#development-workflows)
- [Creating New Tools](#creating-new-tools)
- [Component System](#component-system)
- [Testing Strategy](#testing-strategy)
- [Code Conventions](#code-conventions)
- [Internationalization](#internationalization)
- [Build and Deployment](#build-and-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Common Patterns](#common-patterns)
- [Important Notes](#important-notes)

---

## Project Overview

**IT-Tools** is a collection of handy online tools for developers with great UX. It's a Vue 3-based web application that provides 80+ developer tools including converters, generators, encoders, and utilities.

- **Primary Language**: TypeScript
- **Framework**: Vue 3 (Composition API)
- **Package Manager**: pnpm (v10.26.0)
- **Node Version**: >= 20.12.0
- **License**: GNU GPLv3

---

## Tech Stack

### Core Technologies

- **Vue 3**: Framework using Composition API with `<script setup>` syntax
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Naive UI**: Primary UI component library
- **UnoCSS**: Utility-first CSS framework

### Key Libraries

- **VueUse**: Composition utilities (v14.0.0)
- **vue-i18n**: Internationalization (v11.0.0)
- **Monaco Editor**: Code editing (v0.55.0)
- **Math.js**: Mathematical operations
- **date-fns**: Date manipulation
- **Lodash**: Utility functions

### Testing

- **Vitest**: Unit testing (v0.34.6)
- **Playwright**: E2E testing (v1.57.0)
- **@vue/test-utils**: Vue component testing

### Development Tools

- **@antfu/eslint-config**: ESLint configuration
- **vue-tsc**: TypeScript type checking for Vue
- **Vite PWA**: Progressive Web App support

---

## Project Structure

```
it-tools/
├── src/
│   ├── tools/              # All tool implementations (88+ tools)
│   │   ├── base64-string-converter/
│   │   │   ├── index.ts              # Tool definition and metadata
│   │   │   ├── base64-string-converter.vue  # UI component
│   │   │   ├── base64-string-converter.service.ts  # Business logic
│   │   │   ├── base64-string-converter.service.test.ts  # Unit tests
│   │   │   └── base64-string-converter.e2e.spec.ts  # E2E tests
│   │   └── index.ts        # Tool registry and categories
│   ├── ui/                 # Reusable UI components (c-* prefix)
│   │   ├── c-card/
│   │   ├── c-button/
│   │   ├── c-input-text/
│   │   └── ...
│   ├── composable/         # Vue composables
│   │   ├── copy.ts         # Clipboard operations
│   │   ├── validation.ts   # Input validation
│   │   ├── downloadBase64.ts
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── base64.ts
│   │   └── ...
│   ├── components/         # General components
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── stores/             # Pinia stores
│   ├── plugins/            # Vue plugins
│   ├── modules/            # Feature modules
│   ├── assets/             # Static assets
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   ├── router.ts           # Route definitions
│   └── config.ts           # App configuration
├── locales/                # i18n translations (9 languages)
│   ├── en.yml
│   ├── fr.yml
│   └── ...
├── scripts/                # Build and utility scripts
│   ├── create-tool.mjs     # Tool scaffolding script
│   └── release.mjs         # Release automation
├── _templates/             # Hygen templates
├── public/                 # Static public assets
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── package.json
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── playwright.config.ts    # Playwright configuration
├── eslint.config.mjs       # ESLint configuration
└── README.md
```

### Directory Purpose

- **`src/tools/`**: Each tool is self-contained in its own directory
- **`src/ui/`**: Shared UI components prefixed with `c-` (e.g., `c-card`, `c-button`)
- **`src/composable/`**: Reusable composition functions following Vue 3 patterns
- **`src/utils/`**: Pure utility functions for data transformation and validation
- **`locales/`**: YAML files for internationalization

---

## Development Workflows

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:5173
```

### Common Commands

```bash
# Development
pnpm dev                    # Start dev server (localhost:5173)

# Building
pnpm build                  # Type check + production build
pnpm preview                # Preview production build (localhost:5050)

# Testing
pnpm test                   # Run unit tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright)
pnpm test:e2e:dev           # Run E2E against dev server
pnpm coverage               # Generate test coverage report

# Code Quality
pnpm lint                   # Run ESLint
pnpm typecheck              # Run TypeScript type checking

# Tool Creation
pnpm script:create:tool <tool-name>    # Scaffold new tool
pnpm script:create:ui                  # Create UI component (Hygen)

# Release
pnpm release                # Create new release
```

### Development Server

- **Dev**: `http://localhost:5173`
- **Preview**: `http://localhost:5050`
- **Hot Module Replacement**: Enabled
- **Auto-imports**: Vue APIs, VueUse, Vue Router, Vue i18n

---

## Creating New Tools

### Automated Tool Creation

Use the built-in scaffolding script:

```bash
pnpm script:create:tool my-awesome-tool
```

This creates:

```
src/tools/my-awesome-tool/
├── index.ts                       # Tool definition
├── my-awesome-tool.vue            # UI component
├── my-awesome-tool.service.ts     # Business logic
├── my-awesome-tool.service.test.ts # Unit tests
└── my-awesome-tool.e2e.spec.ts    # E2E tests
```

And automatically adds the import to `src/tools/index.ts`.

### Tool Definition Structure

**`index.ts`** - Tool metadata and registration:

```typescript
import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Tool Name',                    // Display name
  path: '/tool-path',                   // URL path
  description: 'Tool description',      // SEO description
  keywords: ['keyword1', 'keyword2'],   // Search keywords
  component: () => import('./tool.vue'), // Lazy-loaded component
  icon: ArrowsShuffle,                  // Icon component
  createdAt: new Date('2024-01-15'),   // Creation date (for "new" badge)
  redirectFrom: ['/old-path'],          // Optional: redirect old URLs
});
```

### Tool Implementation Pattern

**`tool.vue`** - Component structure:

```vue
<script setup lang="ts">
import { useCopy } from '@/composable/copy';

// State
const input = ref('');
const output = computed(() => transformInput(input.value));

// Composables
const { copy } = useCopy({
  source: output,
  text: 'Copied to clipboard'
});

// Business logic imported from service
import { transformInput } from './tool.service';
</script>

<template>
  <c-card title="Section Title">
    <c-input-text
      v-model:value="input"
      label="Input"
      placeholder="Enter text..."
      multiline
      rows="5"
    />

    <c-input-text
      :value="output"
      label="Output"
      readonly
      multiline
      rows="5"
    />

    <c-button @click="copy()">
      Copy Result
    </c-button>
  </c-card>
</template>
```

**`tool.service.ts`** - Pure business logic:

```typescript
export { transformInput };

function transformInput(input: string): string {
  // Pure function - no Vue dependencies
  // Easy to test
  return input.toUpperCase();
}
```

**`tool.service.test.ts`** - Unit tests:

```typescript
import { describe, expect, it } from 'vitest';
import { transformInput } from './tool.service';

describe('tool-name', () => {
  it('transforms input correctly', () => {
    expect(transformInput('hello')).toBe('HELLO');
  });
});
```

**`tool.e2e.spec.ts`** - E2E tests:

```typescript
import { expect, test } from '@playwright/test';

test.describe('Tool - Tool Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tool-path');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Tool Name - IT Tools');
  });

  test('Performs transformation', async ({ page }) => {
    // Test user interactions
  });
});
```

### Registering the Tool

Add to **`src/tools/index.ts`**:

```typescript
import { tool as myAwesomeTool } from './my-awesome-tool';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Converter',  // Choose appropriate category
    components: [
      // ... other tools
      myAwesomeTool,
    ],
  },
  // ...
];
```

**Available Categories**:
- Crypto
- Converter
- Web
- Images And Videos
- Development
- Network
- Math
- Measurement
- Text
- Data

---

## Component System

### Custom Components (c-* prefix)

IT-Tools uses custom components prefixed with `c-` for consistency:

#### Common Components

- **`<c-card>`**: Container with optional title
  ```vue
  <c-card title="Section Title">
    <!-- content -->
  </c-card>
  ```

- **`<c-input-text>`**: Text input with validation
  ```vue
  <c-input-text
    v-model:value="text"
    label="Label"
    placeholder="Placeholder"
    multiline
    rows="5"
    readonly
    :validation-rules="rules"
  />
  ```

- **`<c-button>`**: Styled button
  ```vue
  <c-button @click="handleClick">
    Button Text
  </c-button>
  ```

- **`<c-select>`**: Dropdown selection
  ```vue
  <c-select
    v-model:value="selected"
    :options="options"
    label="Choose option"
  />
  ```

- **`<c-text-copyable>`**: Text with copy button
  ```vue
  <c-text-copyable :value="text" />
  ```

### Naive UI Components

Naive UI components are auto-imported with `n-` prefix:

- `<n-form-item>`, `<n-switch>`, `<n-checkbox>`, `<n-radio>`, etc.
- Use for complex form controls not covered by custom components

### UnoCSS Utilities

Utility classes are available for styling:

```vue
<template>
  <div flex justify-center mb-5>
    <c-button>Centered Button</c-button>
  </div>
</template>
```

Common utilities: `flex`, `grid`, `m-*`, `p-*`, `text-*`, `bg-*`

---

## Testing Strategy

### Unit Tests (Vitest)

- **Location**: `*.service.test.ts` files
- **Purpose**: Test pure business logic functions
- **Run**: `pnpm test`

```typescript
import { describe, expect, it } from 'vitest';

describe('functionName', () => {
  it('should handle valid input', () => {
    expect(functionName('input')).toBe('output');
  });

  it('should throw on invalid input', () => {
    expect(() => functionName('')).toThrow();
  });
});
```

### E2E Tests (Playwright)

- **Location**: `*.e2e.spec.ts` files
- **Purpose**: Test user interactions and UI
- **Run**: `pnpm test:e2e`
- **Browsers**: Chromium, Firefox, WebKit

```typescript
import { expect, test } from '@playwright/test';

test.describe('Tool - Tool Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tool-path');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Tool Name - IT Tools');
  });
});
```

### Testing Best Practices

1. **Separation**: Keep business logic in `.service.ts` files for easy unit testing
2. **Coverage**: Aim for high coverage on service files
3. **E2E Focus**: Test critical user flows and edge cases
4. **Test IDs**: Use `data-test-id` attribute for stable selectors
5. **Locale**: Tests run with `locale: 'en-GB'` and `timezoneId: 'Europe/Paris'`

---

## Code Conventions

### TypeScript

- **Strict mode**: Enabled
- **No implicit any**: Required
- **Type everything**: Functions, props, events, refs
- **Prefer types over interfaces**: For consistency with Vue 3

### Vue Composition API

- **`<script setup lang="ts">`**: Always use setup syntax
- **Reactive state**: Use `ref()` and `reactive()`
- **Computed values**: Use `computed()`
- **Props destructuring**: Use `toRefs()` for reactivity

```typescript
const props = defineProps<{
  value: string;
  count?: number;
}>();

const { value, count } = toRefs(props);
```

### ESLint Rules

Key rules from `eslint.config.mjs`:

- **Semicolons**: Required
- **Curly braces**: Required for all control structures
- **No unused vars**: Error
- **Empty component blocks**: Not allowed
- **Custom restriction**: Don't use `useClipboard` from VueUse, use `useCopy` from `@/composable/copy.ts`

```typescript
// ❌ Wrong
import { useClipboard } from '@vueuse/core';

// ✅ Correct
import { useCopy } from '@/composable/copy';
```

### File Naming

- **Components**: `kebab-case.vue` (e.g., `base64-string-converter.vue`)
- **Services**: `kebab-case.service.ts`
- **Tests**: `kebab-case.test.ts` or `kebab-case.e2e.spec.ts`
- **Types**: `kebab-case.types.ts`
- **Utils**: `kebab-case.ts`

### Code Organization

1. **Imports**: Group by external, then internal
2. **Props/Emits**: Define at top of `<script setup>`
3. **Composables**: After props
4. **State**: After composables
5. **Computed**: After state
6. **Methods**: After computed
7. **Lifecycle hooks**: Last

### Styling

- **Scoped styles**: Always use `<style lang="less" scoped>`
- **Theme variables**: Use `v-bind()` for dynamic theming
- **UnoCSS first**: Use utility classes when possible
- **Custom styles**: Only when necessary

```vue
<script setup lang="ts">
import { useTheme } from './component.theme';
const theme = useTheme();
</script>

<style lang="less" scoped>
.component {
  background-color: v-bind('theme.backgroundColor');
}
</style>
```

---

## Internationalization

### Structure

- **Locale files**: `locales/{lang}.yml`
- **Supported languages**: English (en), French (fr), German (de), Spanish (es), Portuguese (pt), Norwegian (no), Ukrainian (uk), Vietnamese (vi), Chinese (zh)
- **Default**: English (en)

### Using i18n in Components

```typescript
import { translate } from '@/plugins/i18n.plugin';

// In tool definition
export const tool = defineTool({
  name: translate('tools.tool-name.title'),
  description: translate('tools.tool-name.description'),
});
```

```vue
<template>
  <c-card :title="$t('tools.tool-name.sections.input')">
    {{ $t('tools.tool-name.placeholder') }}
  </c-card>
</template>
```

### i18n File Structure

```yaml
# locales/en.yml
tools:
  base64-string-converter:
    title: Base64 String Converter
    description: Encode and decode Base64 strings
    sections:
      input: String to base64
      output: Base64 to string
```

### i18n Best Practices

1. **Always provide English**: Primary language for fallback
2. **Nested keys**: Use tool name as namespace
3. **Descriptive keys**: Use semantic names, not generic ones
4. **VSCode extension**: Use "i18n Ally" for easier management

---

## Build and Deployment

### Build Configuration

**Vite Plugins**:
- `@vitejs/plugin-vue`: Vue 3 SFC support
- `@vitejs/plugin-vue-jsx`: JSX support
- `unplugin-auto-import`: Auto-import Vue APIs
- `unplugin-vue-components`: Auto-import components
- `unplugin-icons`: Icon components
- `vite-plugin-pwa`: PWA manifest and service worker
- `vite-plugin-vue-markdown`: Markdown support
- `vite-svg-loader`: SVG as components
- `unocss/vite`: Utility CSS

### Auto-imports

The following are auto-imported:

**Vue APIs**: `ref`, `computed`, `watch`, `onMounted`, etc.
**Vue Router**: `useRouter`, `useRoute`
**VueUse**: All composables
**Vue i18n**: `useI18n`, `useLocale`
**Naive UI**: `useDialog`, `useMessage`, `useNotification`, `useLoadingBar`

No need to import these explicitly!

### Path Aliases

```typescript
// @ maps to src/
import { useCopy } from '@/composable/copy';
import MyComponent from '@/components/MyComponent.vue';
```

### Browser Polyfills

Node.js modules are polyfilled for browser:

- `crypto` → `crypto-browserify`
- `stream` → `stream-browserify`
- `buffer` → `buffer`
- `events` → `events`
- `path` → `path-browserify`
- `vm` → `vm-browserify`

### Build Commands

```bash
# Development build (with HMR)
pnpm dev

# Production build
pnpm build
# Outputs to: dist/

# Preview production build
pnpm preview
```

### Build Optimization

- **Code splitting**: Automatic with Vite
- **Tree shaking**: Enabled
- **Minification**: Terser for JS, cssnano for CSS
- **Asset optimization**: Images, fonts, etc.
- **PWA**: Service worker with workbox
- **Max old space size**: 4096MB for large builds

---

## CI/CD Pipeline

### GitHub Actions Workflows

Located in `.github/workflows/`:

#### 1. **ci.yml** - Continuous Integration

Runs on: PR and push to main (except markdown files)

Steps:
1. **Setup**: Node 24, pnpm cache
2. **Install**: Dependencies
3. **Lint**: ESLint with caching
4. **Test**: Unit tests (Vitest)
5. **Type check**: vue-tsc
6. **Build**: Production build

**Caches**:
- Vite build cache
- ESLint cache
- Vitest cache
- TypeScript build info

#### 2. **e2e-tests.yml** - End-to-End Tests

Runs Playwright tests across browsers.

#### 3. **node.js.yml** - Node.js Matrix Testing

Tests across Node versions.

#### 4. **releases.yml** - Release Automation

Automated releases and changelog generation.

#### 5. **docker-nightly-release.yml** - Docker Publishing

Builds and publishes Docker images.

### Concurrency

CI uses concurrency groups to cancel outdated runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```

---

## Common Patterns

### Composables

#### Copy to Clipboard

```typescript
import { useCopy } from '@/composable/copy';

const { copy } = useCopy({
  source: computed(() => myValue.value),
  text: 'Custom success message'
});

// Later
await copy();
```

#### Validation

```typescript
import { useValidation } from '@/composable/validation';

const value = ref('');
const { validation } = useValidation({
  source: value,
  rules: [
    {
      message: 'Invalid input',
      validator: (val) => val.length > 0,
    },
  ],
});

// In template
<c-input-text
  v-model:value="value"
  :validation-rules="validation.rules"
/>
```

#### File Download

```typescript
import { downloadBase64 } from '@/composable/downloadBase64';

downloadBase64({
  source: base64String,
  filename: 'output.txt',
  mimeType: 'text/plain',
});
```

### Utility Patterns

#### Error Handling with Defaults

```typescript
import { withDefaultOnError } from '@/utils/defaults';

const result = computed(() =>
  withDefaultOnError(
    () => riskyOperation(input.value),
    'default value'
  )
);
```

#### Storage with Reactivity

```typescript
// Uses VueUse's useStorage
const setting = useStorage('tool-name--setting-key', defaultValue);

// Automatically synced with localStorage
// Reactive across tabs
```

### Component Patterns

#### Two-way Binding

```typescript
// Parent
<MyComponent v-model:value="text" />

// Child component
const props = defineProps<{ value: string }>();
const emit = defineEmits(['update:value']);

const value = useVModel(props, 'value', emit);
```

#### Conditional Rendering

```vue
<template>
  <!-- Use v-if for expensive components -->
  <c-card v-if="showCard">
    <ExpensiveComponent />
  </c-card>

  <!-- Use v-show for toggling visibility -->
  <div v-show="isVisible">
    Toggle content
  </div>
</template>
```

---

## Important Notes

### Security

- **No sensitive operations**: All tools run client-side
- **Input sanitization**: Validate and sanitize user input
- **XSS prevention**: Use DOMPurify for HTML sanitization
- **CSP**: Content Security Policy configured

### Performance

- **Lazy loading**: All tools are lazy-loaded
- **Code splitting**: Automatic per tool
- **Virtual scrolling**: For large lists
- **Debounced inputs**: Use `debouncedRef` for expensive operations

```typescript
import { debouncedRef } from '@/composable/debouncedref';

const input = debouncedRef('', 500); // 500ms debounce
```

### Accessibility

- **Semantic HTML**: Use proper HTML elements
- **ARIA labels**: Add for screen readers
- **Keyboard navigation**: Support tab and enter
- **Focus management**: Proper focus indicators

### Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **ES modules**: Required
- **Service Workers**: For PWA features
- **Local Storage**: For settings persistence

### VSCode Recommended Extensions

From `README.md`:
1. **Volar** - Vue language support
2. **TypeScript Vue Plugin (Volar)** - Vue TypeScript support
3. **ESLint** - Linting
4. **i18n Ally** - i18n management

### VSCode Settings

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

---

## Quick Reference

### When Creating a New Tool

1. Run: `pnpm script:create:tool tool-name`
2. Implement business logic in `.service.ts`
3. Write unit tests in `.service.test.ts`
4. Build UI in `.vue` file using `c-*` components
5. Add E2E tests in `.e2e.spec.ts`
6. Register in `src/tools/index.ts` under appropriate category
7. Add i18n entries to `locales/en.yml`
8. Test with `pnpm dev`
9. Run tests: `pnpm test && pnpm test:e2e`
10. Lint: `pnpm lint`

### When Modifying Existing Code

1. Read existing code first
2. Follow established patterns
3. Update tests
4. Check TypeScript types
5. Run linter
6. Test manually

### When Debugging

1. Check browser console
2. Use Vue DevTools
3. Check TypeScript errors: `pnpm typecheck`
4. Check ESLint: `pnpm lint`
5. Run tests: `pnpm test`

---

## Additional Resources

- **Repository**: https://github.com/CorentinTh/it-tools
- **Live Site**: https://it-tools.tech
- **Issue Tracker**: https://github.com/CorentinTh/it-tools/issues
- **Contributing**: See README.md

---

*This documentation is maintained for AI assistants. Last updated: 2024-12-22*
