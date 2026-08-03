import { describe, expect, it } from 'vitest';
import { generateMeta } from './oggen';

describe('oggen', () => {
  describe('generateMeta', () => {
    it('does not emit twitter-compatible fallbacks when the option is disabled (default)', () => {
      const result = generateMeta({ title: 'T', twitter: { card: 'summary' } });

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og:title" content="T" />',
        '',
        '<!-- twitter meta -->',
        '<meta name="twitter:card" content="summary" />',
      ].join('\n'));
      expect(result).not.toContain('twitter:title');
    });

    it('emits twitter-compatible fallbacks from og values when the option is enabled', () => {
      const result = generateMeta({ title: 'My title', twitter: { card: 'summary' } }, { generateTwitterCompatibleMeta: true });

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og:title" content="My title" />',
        '',
        '<!-- twitter meta -->',
        '<meta name="twitter:card" content="summary" />',
        '<meta name="twitter:title" content="My title" />',
      ].join('\n'));
    });

    it('skips undefined and empty-string values', () => {
      // Optional schema fields can reach oggen as `undefined` at runtime even
      // though the direct-call signature doesn't model it; cast to exercise the
      // undefined/empty-string skip guard.
      const result = generateMeta({ a: undefined, b: '', c: 'yes' } as unknown as Parameters<typeof generateMeta>[0]);

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og:c" content="yes" />',
      ].join('\n'));
    });

    it('flattens array values into repeated meta tags', () => {
      const result = generateMeta({ image: ['x', 'y'] });

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og:image" content="x" />',
        '<meta property="og:image" content="y" />',
      ].join('\n'));
    });

    it('serialises Date values as ISO strings', () => {
      const result = generateMeta({ published: new Date('2020-01-02T03:04:05.000Z') });

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og:published" content="2020-01-02T03:04:05.000Z" />',
      ].join('\n'));
    });

    it('falls back to an empty segment for keys with no snake-case-able characters', () => {
      const result = generateMeta({ '!!': 'v' });

      expect(result).toBe([
        '<!-- og meta -->',
        '<meta property="og" content="v" />',
      ].join('\n'));
    });
  });
});
