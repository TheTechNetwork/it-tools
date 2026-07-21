import { describe, expect, it } from 'vitest';
import { generatePort } from './random-port-generator.service';

describe('random-port-generator', () => {
  describe('generatePort', () => {
    it('generates integer ports', () => {
      for (let i = 0; i < 100; i++) {
        expect(Number.isInteger(generatePort())).toBe(true);
      }
    });

    it('generates ports outside of the system (well-known) port range', () => {
      for (let i = 0; i < 1000; i++) {
        expect(generatePort()).toBeGreaterThanOrEqual(1024);
      }
    });

    it('generates ports within the valid port range', () => {
      for (let i = 0; i < 1000; i++) {
        expect(generatePort()).toBeLessThanOrEqual(65535);
      }
    });

    it('generates varying values', () => {
      const ports = new Set(Array.from({ length: 100 }, () => generatePort()));

      expect(ports.size).toBeGreaterThan(1);
    });
  });
});
