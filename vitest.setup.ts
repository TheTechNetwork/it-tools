// Vitest setup file to initialize test environment globals
import { Buffer as NodeBuffer } from 'node:buffer';

// jsdom should already have atob/btoa, but ensure a Buffer global is available.
// Assign onto globalThis through a typed alias so the polyfill is applied.
const globalScope = globalThis as unknown as { Buffer?: unknown };
if (typeof window !== 'undefined' && globalScope.Buffer === undefined) {
  globalScope.Buffer = NodeBuffer;
}

// Node 25+ defines experimental localStorage/sessionStorage global accessors
// that yield undefined (or a non-functional stub) without --localstorage-file,
// and they shadow jsdom's implementation because vitest does not override
// pre-existing Node globals. Replace any Storage global that lacks a working
// API with an in-memory implementation.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(String(key)) ?? null,
    setItem: (key: string, value: string) => {
      store.set(String(key), String(value));
    },
    removeItem: (key: string) => {
      store.delete(String(key));
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  const storage = (globalThis as any)[name];
  const hasWorkingStorage = storage !== undefined && storage !== null && typeof storage.clear === 'function';
  if (name in globalThis && !hasWorkingStorage) {
    const replacement = createMemoryStorage();
    Object.defineProperty(globalThis, name, { value: replacement, configurable: true, writable: true });
    if (typeof window !== 'undefined' && (window as any)[name] !== replacement) {
      try {
        Object.defineProperty(window, name, { value: replacement, configurable: true });
      }
      catch {
        // window may be the same object as globalThis; already handled above
      }
    }
  }
}
