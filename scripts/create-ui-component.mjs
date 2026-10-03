// Scaffold a UI component, as `hygen generator ui-component` used to.
//
// WHY THIS IS NOT HYGEN ANY MORE. Hygen is abandoned — last published 2022 —
// and brought fourteen runtime dependencies of its own to write the thirteen
// lines below into two files. An unmaintained package stops refreshing its
// dependency tree, and that tree is what rots; carrying one for a template
// this size is the trade the wrong way round.
//
// It is a sibling of create-tool.mjs deliberately: same shape, same argv, same
// console output, so there is one way to read a generator in this repo rather
// than two.
//
// The prompt is kept. Hygen asked for a name when you omitted one, and a
// script that threw instead would be a worse tool than the one it replaced.

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { kebabCase } from 'change-case';

const currentDirname = dirname(fileURLToPath(import.meta.url));
const uiDir = join(currentDirname, '..', 'src', 'ui');

async function askForName() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await rl.question('Component name: ');
  }
  finally {
    rl.close();
  }
}

const rawName = process.argv[2] ?? (await askForName());

if (!rawName?.trim()) {
  throw new Error('Please specify a component name.');
}

// `h.changeCase.param()` in the old templates — param-case is kebab-case, and
// change-case is already a dependency of this project, so this adds nothing.
const name = kebabCase(rawName.trim());
const componentDir = join(uiDir, name);

// Hygen refused to clobber a file it had not written; so does this, rather
// than silently rewriting a component somebody has already filled in.
for (const file of [`${name}.vue`, `${name}.demo.vue`]) {
  if (existsSync(join(componentDir, file))) {
    throw new Error(`${join(componentDir, file)} already exists — delete it first, or pick another name.`);
  }
}

await mkdir(componentDir, { recursive: true });
console.log(`Directory created: ${componentDir}`);

async function createComponentFile(fileName, content) {
  const filePath = join(componentDir, fileName);
  await writeFile(filePath, `${content.trim()}\n`);
  console.log(`File created: ${filePath}`);
}

await createComponentFile(
  `${name}.vue`,
  `
<script lang="ts" setup>
const props = withDefaults(defineProps<{ prop?: string }>(), { prop: '' });
const { prop } = toRefs(props);
</script>

<template>
  <div>
    {{ prop }}
  </div>
</template>
`,
);

await createComponentFile(
  `${name}.demo.vue`,
  `
<template>
  <${name} />
</template>
`,
);
