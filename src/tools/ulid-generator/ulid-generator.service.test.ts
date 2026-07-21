import { describe, expect, it } from 'vitest';
import { generateUlids } from './ulid-generator.service';

const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe('ulid-generator', () => {
  describe('generateUlids', () => {
    it('generates a single raw ulid by default', () => {
      const result = generateUlids();

      expect(result).toMatch(ulidRegex);
    });

    it('generates the requested amount of ulids, one per line', () => {
      const result = generateUlids({ amount: 5, format: 'raw' });
      const lines = result.split('\n');

      expect(lines).toHaveLength(5);
      for (const line of lines) {
        expect(line).toMatch(ulidRegex);
      }
    });

    it('generates unique ulids', () => {
      const lines = generateUlids({ amount: 100, format: 'raw' }).split('\n');

      expect(new Set(lines).size).toBe(100);
    });

    it('generates a json array when the format is json', () => {
      const result = generateUlids({ amount: 3, format: 'json' });
      const parsed = JSON.parse(result);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(3);
      for (const id of parsed) {
        expect(id).toMatch(ulidRegex);
      }
    });

    it('pretty prints the json output', () => {
      const result = generateUlids({ amount: 2, format: 'json' });

      expect(result).toContain('\n');
      expect(result.startsWith('[')).toBe(true);
      expect(result.endsWith(']')).toBe(true);
    });

    it('generates lexicographically sortable ulids over time', async () => {
      const first = generateUlids({ amount: 1, format: 'raw' });

      await new Promise(resolve => setTimeout(resolve, 5));

      const second = generateUlids({ amount: 1, format: 'raw' });

      expect(second > first).toBe(true);
      // The 10 first characters encode the timestamp
      expect(second.slice(0, 10) >= first.slice(0, 10)).toBe(true);
    });
  });
});
