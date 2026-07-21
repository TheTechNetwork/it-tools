// Vitest setup file to initialize test environment globals

// jsdom should already have atob/btoa, but ensure they're properly configured
if (typeof window !== 'undefined' && typeof global !== 'undefined') {
  // Ensure Buffer is available if needed
  if (typeof Buffer === 'undefined') {
    (global as any).Buffer = require('buffer').Buffer;
  }
}

// Node 25+ defines an experimental localStorage/sessionStorage global that is
// non-functional without --localstorage-file and shadows jsdom's implementation
// (vitest does not override pre-existing Node globals). Replace any Storage
// global that lacks a working API with an in-memory implementation.
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
  if (storage !== undefined && typeof storage.clear !== 'function') {
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
