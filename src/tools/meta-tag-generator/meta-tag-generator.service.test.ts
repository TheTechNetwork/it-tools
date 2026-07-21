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

      expect(html).toContain('<meta property="og:type" value="website" />');
      expect(html).toContain('<meta property="og:title" value="My title" />');
      expect(html).toContain('<meta property="og:description" value="My description" />');
    });

    it('moves twitter-prefixed keys into dedicated twitter meta tags', () => {
      const html = generateMetaTags({
        'type': 'website',
        'title': 'My title',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@my-site',
      });

      expect(html).toContain('<meta name="twitter:card" value="summary_large_image" />');
      expect(html).toContain('<meta name="twitter:site" value="@my-site" />');
      expect(html).not.toContain('og:twitter');
    });

    it('generates twitter compatible meta from og values', () => {
      const html = generateMetaTags({
        'type': 'website',
        'title': 'My title',
        'twitter:card': 'summary_large_image',
      });

      expect(html).toContain('<meta name="twitter:title" value="My title" />');
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
        '<meta property="og:type" value="website" />',
        '<meta property="og:title" value="My title" />',
        '',
        '<!-- twitter meta -->',
        '<meta name="twitter:card" value="summary_large_image" />',
        '<meta name="twitter:site" value="@site" />',
        '<meta name="twitter:title" value="My title" />',
      ].join('\n'));
    });

    it('handles an empty metadata object', () => {
      expect(generateMetaTags({})).toBe('');
    });
  });
});
