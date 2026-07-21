import { describe, expect, it } from 'vitest';
import { generateLoremIpsum } from './lorem-ipsum-generator.service';

describe('lorem-ipsum-generator', () => {
  describe('generateLoremIpsum', () => {
    it('generates the requested number of paragraphs', () => {
      const text = generateLoremIpsum({ paragraphCount: 3 });

      expect(text.split('\n\n')).toHaveLength(3);
    });

    it('generates the requested number of sentences per paragraph', () => {
      const text = generateLoremIpsum({
        paragraphCount: 1,
        sentencePerParagraph: 4,
        startWithLoremIpsum: false,
      });

      expect(text.match(/\./g)).toHaveLength(4);
    });

    it('generates sentences with the requested word count', () => {
      const text = generateLoremIpsum({
        paragraphCount: 1,
        sentencePerParagraph: 1,
        wordCount: 7,
        startWithLoremIpsum: false,
      });

      expect(text.split(' ')).toHaveLength(7);
    });

    it('starts with the classic lorem ipsum sentence when startWithLoremIpsum is true', () => {
      const text = generateLoremIpsum({ startWithLoremIpsum: true });

      expect(text.startsWith('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')).toBe(true);
    });

    it('does not start with the classic sentence when startWithLoremIpsum is false', () => {
      const text = generateLoremIpsum({ paragraphCount: 1, wordCount: 2, startWithLoremIpsum: false });

      expect(text.startsWith('Lorem ipsum dolor sit amet')).toBe(false);
    });

    it('capitalizes sentences and ends them with a period', () => {
      const text = generateLoremIpsum({
        paragraphCount: 1,
        sentencePerParagraph: 1,
        wordCount: 5,
        startWithLoremIpsum: false,
      });

      expect(text).toMatch(/^[A-Z]/);
      expect(text.endsWith('.')).toBe(true);
    });

    it('wraps paragraphs in <p> tags when asHTML is true', () => {
      const html = generateLoremIpsum({ paragraphCount: 2, asHTML: true });

      expect(html.startsWith('<p>')).toBe(true);
      expect(html.endsWith('</p>')).toBe(true);
      expect(html.match(/<p>/g)).toHaveLength(2);
      expect(html.match(/<\/p>/g)).toHaveLength(2);
    });

    it('generates only words from the latin-ish vocabulary', () => {
      const text = generateLoremIpsum({
        paragraphCount: 1,
        sentencePerParagraph: 2,
        wordCount: 20,
        startWithLoremIpsum: false,
      });

      expect(text).toMatch(/^[a-z .]+$/i);
    });
  });
});
