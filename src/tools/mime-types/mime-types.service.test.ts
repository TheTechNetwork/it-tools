import { describe, expect, it } from 'vitest';
import {
  getExtensionsFromMimeType,
  getExtensionToMimeTypeOptions,
  getMimeInfos,
  getMimeTypeFromExtension,
  getMimeTypeToExtensionOptions,
} from './mime-types.service';

describe('mime-types', () => {
  describe('getMimeInfos', () => {
    it('returns mime type and extensions pairs', () => {
      const infos = getMimeInfos();

      expect(infos.length).toBeGreaterThan(0);
      expect(infos.every(({ mimeType, extensions }) => typeof mimeType === 'string' && Array.isArray(extensions))).toBe(true);
    });

    it('contains well known mime types', () => {
      const infos = getMimeInfos();
      const json = infos.find(({ mimeType }) => mimeType === 'application/json');

      expect(json).toBeDefined();
      expect(json!.extensions).toContain('json');
    });
  });

  describe('getMimeTypeToExtensionOptions', () => {
    it('builds select options keyed by mime type', () => {
      const options = getMimeTypeToExtensionOptions();

      expect(options.length).toBeGreaterThan(0);
      expect(options.every(({ label, value }) => label === value)).toBe(true);
      expect(options.map(({ value }) => value)).toContain('application/pdf');
    });
  });

  describe('getExtensionToMimeTypeOptions', () => {
    it('builds select options with dot-prefixed labels', () => {
      const options = getExtensionToMimeTypeOptions();

      expect(options.length).toBeGreaterThan(0);
      expect(options.every(({ label, value }) => label === `.${value}`)).toBe(true);
      expect(options.find(({ value }) => value === 'html')).toEqual({ label: '.html', value: 'html' });
    });
  });

  describe('getExtensionsFromMimeType', () => {
    it('returns the extensions of a known mime type', () => {
      expect(getExtensionsFromMimeType('application/pdf')).toContain('pdf');
      expect(getExtensionsFromMimeType('text/html')).toContain('html');
      expect(getExtensionsFromMimeType('image/jpeg')).toContain('jpeg');
    });

    it('returns an empty array for an unknown mime type', () => {
      expect(getExtensionsFromMimeType('application/does-not-exist')).toEqual([]);
      expect(getExtensionsFromMimeType('')).toEqual([]);
    });
  });

  describe('getMimeTypeFromExtension', () => {
    it('returns the mime type of a known extension', () => {
      expect(getMimeTypeFromExtension('json')).toBe('application/json');
      expect(getMimeTypeFromExtension('html')).toBe('text/html');
      expect(getMimeTypeFromExtension('pdf')).toBe('application/pdf');
      expect(getMimeTypeFromExtension('png')).toBe('image/png');
    });

    it('returns undefined for an unknown extension', () => {
      expect(getMimeTypeFromExtension('does-not-exist')).toBeUndefined();
      expect(getMimeTypeFromExtension('')).toBeUndefined();
    });
  });
});
