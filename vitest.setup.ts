// Vitest setup file to initialize test environment globals

// jsdom should already have atob/btoa, but ensure they're properly configured
if (typeof window !== 'undefined' && typeof global !== 'undefined') {
  // Ensure Buffer is available if needed
  if (typeof Buffer === 'undefined') {
    (global as any).Buffer = require('buffer').Buffer;
  }
}
