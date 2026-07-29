import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

// Guards against broken i18n references. Every STATIC key passed to t()/$t()/
// translate() in the source must resolve to a real leaf string in the base
// locale (locales/en.yml). This catches the class of regression the i18n
// coverage test cannot see: a renamed, deleted or mistyped in-tool key that
// would render a raw `tools.foo.bar` string in production while every other
// test still passes.
//
// Only fully-literal, dotted keys are checked. Keys built dynamically
// (template literals, string concatenation) can't be resolved statically and
// are skipped by design.

const ROOT = resolve(import.meta.dirname, '../..');
const SRC = resolve(ROOT, 'src');
const EN_LOCALE = resolve(ROOT, 'locales/en.yml');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' ? [] : walk(full);
    }
    return [full];
  });
}

function sourceFiles(): string[] {
  return walk(SRC).filter(f =>
    (f.endsWith('.vue') || f.endsWith('.ts'))
    && !f.endsWith('.d.ts')
    && !f.endsWith('.test.ts')
    && !f.endsWith('.spec.ts')
    && !f.endsWith('.e2e.spec.ts'),
  );
}

// Flatten the nested locale object into the set of dotted LEAF keys (keys whose
// value is a string). A reference to a parent (object) key is therefore treated
// as unresolved, which is correct — you can't render an object.
function flattenLeafKeys(obj: unknown, prefix = '', out = new Set<string>()): Set<string> {
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'string') {
        out.add(path);
      }
      else {
        flattenLeafKeys(v, path, out);
      }
    }
  }
  return out;
}

// Match the first string-literal argument of t(...) / $t(...) / translate(...).
// The negative lookbehind avoids matching identifiers that merely end in "t"
// (e.g. `format(`), and only single/double-quoted literals are captured so
// template-literal/dynamic keys are ignored.
const CALL_RE = /(?<![\w$.])(?:\$?t|translate)\(\s*(['"])((?:\\.|(?!\1).)*)\1/g;
// Only validate things that look like i18n paths: dotted identifiers.
const KEY_RE = /^[\w-]+(?:\.[\w-]+)+$/;

function keysUsedIn(content: string): string[] {
  const keys: string[] = [];
  for (const match of content.matchAll(CALL_RE)) {
    const key = match[2];
    if (KEY_RE.test(key)) {
      keys.push(key);
    }
  }
  return keys;
}

describe('i18n key resolution', () => {
  const enLocale = parse(readFileSync(EN_LOCALE, 'utf8')) ?? {};
  const leafKeys = flattenLeafKeys(enLocale);

  const references = new Map<string, string[]>(); // key -> files referencing it
  for (const file of sourceFiles()) {
    if (statSync(file).isDirectory()) {
      continue;
    }
    const content = readFileSync(file, 'utf8');
    for (const key of keysUsedIn(content)) {
      const rel = file.slice(ROOT.length + 1);
      const list = references.get(key) ?? [];
      if (!list.includes(rel)) {
        list.push(rel);
      }
      references.set(key, list);
    }
  }

  it('resolves every static t()/translate() key against locales/en.yml', () => {
    const missing = [...references.entries()]
      .filter(([key]) => !leafKeys.has(key))
      .map(([key, files]) => `  ${key}  (used in ${files.join(', ')})`);

    expect(
      missing,
      missing.length > 0
        ? `Unresolved i18n keys — add them to locales/en.yml (or fix the reference):\n${missing.join('\n')}`
        : undefined,
    ).toEqual([]);
  });
});
