// Monaco computes the diff (and runs its editor services) in a web worker.
// Without a configured worker the diff editor still mounts, but no diff is ever
// computed — the panes render with no change highlighting. Wire up the *base*
// editor worker only: the text-diff editor uses plain-text ('txt') models, so
// no language workers are needed, which is what keeps the bundle slim.
//
// Imported for its side effect (before any editor is created). The exports-map
// path `monaco-editor/editor/editor.worker` resolves to
// `esm/vs/editor/editor.worker.js`; Vite's `?worker` suffix bundles it as a
// same-origin worker chunk (served under /assets, allowed by `worker-src 'self'`).
import type * as monaco from 'monaco-editor/editor/editor.api';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';

(globalThis as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};
