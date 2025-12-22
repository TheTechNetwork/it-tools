// Vitest setup file to initialize test environment globals
import { vi } from 'vitest';

// Ensure window.atob and window.btoa are properly available in jsdom
if (typeof window !== 'undefined') {
  if (!window.atob) {
    window.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
  }
  if (!window.btoa) {
    window.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
  }
}
