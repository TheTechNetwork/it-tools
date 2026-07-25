// Browser polyfills for the Node.js `global` and `process` globals.
//
// Several tools depend (transitively) on browserified Node modules — most
// notably bcryptjs, which pulls in crypto-browserify via the repo-wide
// `crypto` → `crypto-browserify` alias. Those modules reference `global` and
// `process` at module-evaluation time. Vite only aliases `global` for its
// dev-time dependency optimisation (see `optimizeDeps` in vite.config.ts), so
// the production bundle ships without either, and the first time such a tool's
// lazily-loaded chunk evaluates it throws `ReferenceError: global is not
// defined` (then `process is not defined`) and the tool renders blank.
//
// main.ts imports this among its eager imports, so both are installed while
// main.ts evaluates — before the app mounts and before any lazy tool chunk can
// evaluate. In environments where they already exist (Node, and the Vite dev
// server) every assignment below is a no-op.

/* eslint-disable node/prefer-global/process -- this module deliberately installs the browser `process` shim */

const globalScope = globalThis as unknown as {
  global?: unknown;
  process?: Record<string, unknown>;
};

if (typeof globalScope.global === 'undefined') {
  globalScope.global = globalThis;
}

if (typeof globalScope.process === 'undefined') {
  globalScope.process = {};
}

const proc = globalScope.process as Record<string, unknown>;

proc.env ??= {};
proc.browser ??= true;
proc.version ??= '';
proc.versions ??= {};
proc.platform ??= 'browser';
proc.title ??= 'browser';
proc.argv ??= [];
proc.cwd ??= () => '/';
proc.nextTick ??= (callback: (...args: unknown[]) => void, ...args: unknown[]) => {
  // queueMicrotask matches Node's process.nextTick semantics (runs before
  // timers/promises resolution), which is what the browserified deps expect.
  queueMicrotask(() => callback(...args));
};
