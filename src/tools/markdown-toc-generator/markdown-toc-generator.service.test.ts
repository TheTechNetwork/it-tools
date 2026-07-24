import { describe, expect, it } from 'vitest';
import { generateToc, slugify } from './markdown-toc-generator.service';

describe('markdown-toc-generator', () => {
  describe('slugify', () => {
    it('lowercases and hyphenates', () => {
      expect(slugify('Getting Started')).toBe('getting-started');
    });

    it('drops punctuation', () => {
      expect(slugify('What is it? (a guide)')).toBe('what-is-it-a-guide');
    });
  });

  describe('generateToc', () => {
    it('returns an empty string when there are no headings', () => {
      expect(generateToc('Just a paragraph.')).toBe('');
    });

    it('builds a nested list from headings', () => {
      const md = '# Title\n## Section A\n### Detail\n## Section B';
      expect(generateToc(md)).toBe(
        '- [Title](#title)\n  - [Section A](#section-a)\n    - [Detail](#detail)\n  - [Section B](#section-b)',
      );
    });

    it('normalizes indentation to the shallowest heading', () => {
      const md = '## First\n### Nested';
      expect(generateToc(md)).toBe('- [First](#first)\n  - [Nested](#nested)');
    });

    it('disambiguates duplicate headings like GitHub', () => {
      const md = '# Notes\n# Notes';
      expect(generateToc(md)).toBe('- [Notes](#notes)\n- [Notes](#notes-1)');
    });

    it('ignores headings inside fenced code blocks', () => {
      const md = '# Real\n```\n# Not a heading\n```\n## Also real';
      expect(generateToc(md)).toBe('- [Real](#real)\n  - [Also real](#also-real)');
    });

    it('respects min and max level filters', () => {
      const md = '# H1\n## H2\n### H3';
      expect(generateToc(md, { minLevel: 2, maxLevel: 3 })).toBe('- [H2](#h2)\n  - [H3](#h3)');
    });

    it('supports an ordered-list bullet', () => {
      const md = '# A\n## B';
      expect(generateToc(md, { bullet: '1.' })).toBe('1. [A](#a)\n  1. [B](#b)');
    });

    it('strips trailing hashes from closed ATX headings', () => {
      expect(generateToc('# Title #')).toBe('- [Title](#title)');
    });
  });
});
