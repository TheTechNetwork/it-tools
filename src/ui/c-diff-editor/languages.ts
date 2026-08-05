// Registers syntax highlighting for the languages the diff tool offers, and
// exposes the dropdown option list.
//
// Highlighting for most languages comes from Monaco's per-language Monarch
// grammars (`languages/definitions/<lang>/register`), which run on the main
// thread and need no web worker — so the heavy language workers (ts.worker
// ~7 MB, etc.) stay out of the bundle. JSON is the exception: it has no Monarch
// grammar, so it uses Monaco's JSON language *service*, which adds validation on
// top of highlighting via a small, lazily-loaded json.worker (wired up in
// monaco-environment.ts).
//
// These are side-effect imports: importing a `register` module registers that
// language with the global Monaco instance. Adding a language here is all it
// takes to offer it in the dropdown (plus an entry in DIFF_LANGUAGES below).
import 'monaco-editor/language/json/monaco.contribution';
import 'monaco-editor/languages/definitions/css/register';
import 'monaco-editor/languages/definitions/dockerfile/register';
import 'monaco-editor/languages/definitions/go/register';
import 'monaco-editor/languages/definitions/graphql/register';
import 'monaco-editor/languages/definitions/html/register';
import 'monaco-editor/languages/definitions/ini/register';
import 'monaco-editor/languages/definitions/java/register';
import 'monaco-editor/languages/definitions/javascript/register';
import 'monaco-editor/languages/definitions/markdown/register';
import 'monaco-editor/languages/definitions/php/register';
import 'monaco-editor/languages/definitions/python/register';
import 'monaco-editor/languages/definitions/ruby/register';
import 'monaco-editor/languages/definitions/rust/register';
import 'monaco-editor/languages/definitions/shell/register';
import 'monaco-editor/languages/definitions/sql/register';
import 'monaco-editor/languages/definitions/typescript/register';
import 'monaco-editor/languages/definitions/xml/register';
import 'monaco-editor/languages/definitions/yaml/register';

// value = Monaco language id; label = what the dropdown shows. Ordered with the
// most common diff targets first, then alphabetical.
export const DIFF_LANGUAGES: { label: string; value: string }[] = [
  { label: 'Plain text', value: 'plaintext' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'SQL', value: 'sql' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Python', value: 'python' },
  { label: 'Shell', value: 'shell' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'Dockerfile', value: 'dockerfile' },
  { label: 'INI / TOML', value: 'ini' },
];
