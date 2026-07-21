import { describe, expect, it } from 'vitest';
import { getFileExtensionFromBase64 } from './base64-file-converter.service';

describe('base64-file-converter', () => {
  describe('getFileExtensionFromBase64', () => {
    it('gets the extension from the mime type of a data-url prefix', () => {
      expect(getFileExtensionFromBase64({ base64String: 'data:image/png;base64,iVBORw0KGgo=' })).toBe('png');
      expect(getFileExtensionFromBase64({ base64String: 'data:application/pdf;base64,JVBERi0=' })).toBe('pdf');
      expect(getFileExtensionFromBase64({ base64String: 'data:text/plain;base64,SGVsbG8=' })).toBe('txt');
    });

    it('infers the extension from well-known base64 signatures without a data-url prefix', () => {
      expect(getFileExtensionFromBase64({ base64String: 'iVBORw0KGgoAAAANSUhEUg' })).toBe('png');
      expect(getFileExtensionFromBase64({ base64String: 'JVBERi0xLjQK' })).toBe('pdf');
      expect(getFileExtensionFromBase64({ base64String: 'R0lGODdhAQABAIAAAP' })).toBe('gif');
      expect(getFileExtensionFromBase64({ base64String: 'R0lGODlhAQABAIAAAP' })).toBe('gif');
    });

    it('returns the default extension when the mime type is unknown', () => {
      expect(getFileExtensionFromBase64({ base64String: 'SGVsbG8gd29ybGQh', defaultExtension: 'bin' })).toBe('bin');
      expect(getFileExtensionFromBase64({ base64String: '', defaultExtension: 'dat' })).toBe('dat');
    });

    it('returns the default extension when the mime type has no known extension', () => {
      // the jpeg signature is mapped to the non-standard 'image/jpg' mime type, which has no extension
      expect(getFileExtensionFromBase64({ base64String: '/9j/4AAQSkZJRg', defaultExtension: 'previous' })).toBe('previous');
    });

    it('returns an empty string when the mime type is unknown and no default is provided', () => {
      expect(getFileExtensionFromBase64({ base64String: 'SGVsbG8gd29ybGQh' })).toBe('');
      expect(getFileExtensionFromBase64({ base64String: '' })).toBe('');
    });
  });
});
