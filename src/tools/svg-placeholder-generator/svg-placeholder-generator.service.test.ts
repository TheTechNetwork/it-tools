import { describe, expect, it } from 'vitest';
import { generateSvgPlaceholder, svgToBase64DataUrl } from './svg-placeholder-generator.service';

const defaultOptions = {
  width: 600,
  height: 350,
  fontSize: 26,
  bgColor: '#cccccc',
  fgColor: '#333333',
  useExactSize: true,
};

describe('svg-placeholder-generator', () => {
  describe('generateSvgPlaceholder', () => {
    it('generates an svg with the given size, colors and font size', () => {
      const svg = generateSvgPlaceholder(defaultOptions);

      expect(svg).toContain('viewBox="0 0 600 350"');
      expect(svg).toContain('width="600" height="350"');
      expect(svg).toContain('<rect width="600" height="350" fill="#cccccc"></rect>');
      expect(svg).toContain('font-size="26px"');
      expect(svg).toContain('fill="#333333"');
      expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
    });

    it('uses the dimensions as default text', () => {
      const svg = generateSvgPlaceholder(defaultOptions);

      expect(svg).toContain('>600x350</text>');
    });

    it('uses the custom text when provided', () => {
      const svg = generateSvgPlaceholder({ ...defaultOptions, customText: 'Hello world' });

      expect(svg).toContain('>Hello world</text>');
      expect(svg).not.toContain('600x350');
    });

    it('omits the exact size attributes when useExactSize is false', () => {
      const svg = generateSvgPlaceholder({ ...defaultOptions, useExactSize: false });

      expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350">')).toBe(true);
      expect(svg).not.toContain('viewBox="0 0 600 350" width="600" height="350"');
    });

    it('reflects custom dimensions everywhere', () => {
      const svg = generateSvgPlaceholder({ ...defaultOptions, width: 100, height: 50 });

      expect(svg).toContain('viewBox="0 0 100 50"');
      expect(svg).toContain('width="100" height="50"');
      expect(svg).toContain('<rect width="100" height="50" fill="#cccccc"></rect>');
      expect(svg).toContain('>100x50</text>');
    });
  });

  describe('svgToBase64DataUrl', () => {
    it('wraps the svg in a base64 data url', () => {
      const svg = generateSvgPlaceholder(defaultOptions);
      const dataUrl = svgToBase64DataUrl(svg);

      expect(dataUrl.startsWith('data:image/svg+xml;base64,')).toBe(true);

      const base64 = dataUrl.replace('data:image/svg+xml;base64,', '');
      const decoded = atob(base64);

      expect(decoded).toBe(svg);
    });
  });
});
