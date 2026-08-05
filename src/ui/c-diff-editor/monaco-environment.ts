// Monaco computes the diff (and runs its editor services) in a web worker.
// Without a configured worker the diff editor still mounts, but no diff is ever
// computed — the panes render with no change highlighting. Wire up the workers
// the diff tool needs:
//
//  - the base editor worker, for the diff computation itself (every language);
//  - the JSON language worker, for JSON validation/formatting when the JSON
//    language is selected. Syntax highlighting for the other languages comes
//    from main-thread Monarch grammars (see languages.ts), so they need no
//    worker — which is what keeps the heavy language workers (ts.worker ~7 MB)
//    out of the bundle.
//
// Imported for its side effect (before any editor is created). The exports-map
// paths (`monaco-editor/editor/editor.worker`, `monaco-editor/language/json/
// json.worker`) resolve under esm/vs/…; Vite's `?worker` suffix bundles each as
// a same-origin worker chunk (served under /assets, allowed by `worker-src 'self'`),
// loaded lazily on demand.
import type * as monaco from 'monaco-editor/editor/editor.api';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/language/json/json.worker?worker';

(globalThis as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};
