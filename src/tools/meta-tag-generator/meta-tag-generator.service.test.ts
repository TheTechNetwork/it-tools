import { describe, expect, it } from 'vitest';
import { generateMetaTags } from './meta-tag-generator.service';

describe('meta-tag-generator', () => {
  describe('generateMetaTags', () => {
    it('generates og meta tags from the metadata', () => {
      const html = generateMetaTags({
        type: 'website',
        title: 'My title',
        description: 'My description',
      });

      expect(html).toContain('<meta property="og:type" content="website" />');
      expect(html).toContain('<meta property="og:title" content="My title" />');
      expect(html).toContain('<meta property="og:description" content="My description" />');
    });

    it('moves twitter-prefixed keys into dedicated twitter meta tags', () => {
      const html = generateMetaTags({
        'type': 'website',
        'title': 'My title',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@my-site',
      });

      expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
      expect(html).toContain('<meta name="twitter:site" content="@my-site" />');
      expect(html).not.toContain('og:twitter');
    });

    it('generates twitter compatible meta from og values', () => {
      const html = generateMetaTags({
        'type': 'website',
        'title': 'My title',
        'twitter:card': 'summary_large_image',
      });

      expect(html).toContain('<meta name="twitter:title" content="My title" />');
    });

    it('generates the full snippet for a typical website config', () => {
      const html = generateMetaTags({
        'type': 'website',
        'title': 'My title',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@site',
      });

      expect(html).toBe([
        '<!-- og meta -->',
        '<meta property="og:type" content="website" />',
        '<meta property="og:title" content="My title" />',
        '',
        '<!-- twitter meta -->',
        '<meta name="twitter:card" content="summary_large_image" />',
        '<meta name="twitter:site" content="@site" />',
        '<meta name="twitter:title" content="My title" />',
      ].join('\n'));
    });

    it('handles an empty metadata object', () => {
      expect(generateMetaTags({})).toBe('');
    });
  });
});
