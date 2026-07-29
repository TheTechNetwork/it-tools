import { afterEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import {
  getExtensionFromMimeType,
  getMimeTypeFromBase64,
  getMimeTypeFromExtension,
  previewImageFromBase64,
  useDownloadFileFromBase64,
  useDownloadFileFromBase64Refs,
} from './downloadBase64';

describe('downloadBase64', () => {
  describe('getMimeTypeFromExtension', () => {
    it('returns the mime type for a known extension', () => {
      expect(getMimeTypeFromExtension('txt')).toBe('text/plain');
      expect(getMimeTypeFromExtension('png')).toBe('image/png');
      expect(getMimeTypeFromExtension('json')).toBe('application/json');
      expect(getMimeTypeFromExtension('pdf')).toBe('application/pdf');
    });

    it('returns false for an unknown extension', () => {
      expect(getMimeTypeFromExtension('does-not-exist')).toBe(false);
    });
  });

  describe('getExtensionFromMimeType', () => {
    it('returns the default extension for a known mime type', () => {
      expect(getExtensionFromMimeType('text/plain')).toBe('txt');
      expect(getExtensionFromMimeType('image/png')).toBe('png');
      expect(getExtensionFromMimeType('application/json')).toBe('json');
    });

    it('returns false for an unknown mime type', () => {
      expect(getExtensionFromMimeType('application/does-not-exist')).toBe(false);
    });
  });

  describe('useDownloadFileFromBase64', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function captureDownloadedAnchor() {
      const anchor = document.createElement('a');
      anchor.click = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue(anchor);
      return anchor;
    }

    it('builds a data URI with the mime type inferred from the extension when the source has none', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('aGVsbG8='), extension: 'txt' });
      download();

      expect(anchor.href).toBe('data:text/plain;base64,aGVsbG8=');
      expect(anchor.download).toBe('file.txt');
    });

    it('falls back to application/octet-stream for an unknown extension', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('aGVsbG8='), extension: 'does-not-exist' });
      download();

      expect(anchor.href).toBe('data:application/octet-stream;base64,aGVsbG8=');
    });

    it('prefers an explicit fileMimeType over the extension lookup', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({
        source: ref('aGVsbG8='),
        extension: 'txt',
        fileMimeType: 'application/custom',
      });
      download();

      expect(anchor.href).toBe('data:application/custom;base64,aGVsbG8=');
    });

    it('keeps the existing data URI when the source already has one', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('data:image/png;base64,iVBORw0KGgo=') });
      download();

      expect(anchor.href).toBe('data:image/png;base64,iVBORw0KGgo=');
    });

    it('throws when the base64 source is empty', () => {
      const { download } = useDownloadFileFromBase64({ source: ref('') });

      expect(() => download()).toThrow('Base64 string is empty');
    });

    it('falls back to the default txt extension when there is no extension, data URI, nor signature', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('aGVsbG8=') });
      download();

      expect(anchor.href).toBe('data:text/plain;base64,aGVsbG8=');
      expect(anchor.download).toBe('file.txt');
    });

    it('derives the filename extension from the data URI mime type when no extension is given', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('data:application/pdf;base64,JVBERi0=') });
      download();

      expect(anchor.href).toBe('data:application/pdf;base64,JVBERi0=');
      expect(anchor.download).toBe('file.pdf');
    });

    it('uses the extension resolved from a present-but-unknown data URI mime type', () => {
      const anchor = captureDownloadedAnchor();

      // mime-types returns `false` for an unknown mime type; since the mimeType
      // is present, getFileExtensionFromMimeType returns that `false` value
      // rather than the default extension (?? only guards null/undefined).
      const { download } = useDownloadFileFromBase64({ source: ref('data:application/unknown-xyz;base64,aGVsbG8=') });
      download();

      expect(anchor.download).toBe('file.false');
    });

    it('appends the extension to a filename that does not already end with it', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('aGVsbG8='), filename: 'myfile', extension: 'txt' });
      download();

      expect(anchor.download).toBe('myfile.txt');
    });

    it('keeps the filename untouched when it already ends with the extension', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64({ source: ref('aGVsbG8='), filename: 'myfile.txt', extension: 'txt' });
      download();

      expect(anchor.download).toBe('myfile.txt');
    });
  });

  describe('useDownloadFileFromBase64Refs', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function captureDownloadedAnchor() {
      const anchor = document.createElement('a');
      anchor.click = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue(anchor);
      return anchor;
    }

    it('reads the source, filename and extension from refs', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64Refs({
        source: ref('aGVsbG8='),
        filename: ref('reactive-name'),
        extension: ref('txt'),
      });
      download();

      expect(anchor.href).toBe('data:text/plain;base64,aGVsbG8=');
      expect(anchor.download).toBe('reactive-name.txt');
    });

    it('works when the optional filename and extension refs are omitted', () => {
      const anchor = captureDownloadedAnchor();

      const { download } = useDownloadFileFromBase64Refs({ source: ref('data:application/pdf;base64,JVBERi0=') });
      download();

      expect(anchor.download).toBe('file.pdf');
    });

    it('throws when the source ref is empty', () => {
      const { download } = useDownloadFileFromBase64Refs({ source: ref('') });

      expect(() => download()).toThrow('Base64 string is empty');
    });
  });

  describe('previewImageFromBase64', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('renders the image into the preview container and returns the image element', () => {
      const container = document.createElement('div');
      container.id = 'previewContainer';
      container.innerHTML = 'stale content';
      document.body.appendChild(container);

      const img = previewImageFromBase64('data:image/png;base64,iVBORw0KGgo=');

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe('data:image/png;base64,iVBORw0KGgo=');
      // the stale content is cleared and replaced by a wrapper div holding the image
      expect(container.querySelector('img')).toBe(img);
      expect(container.textContent).toBe('');
    });

    it('throws when the base64 string is empty', () => {
      expect(() => previewImageFromBase64('')).toThrow('Base64 string is empty');
    });

    it('throws when the preview container element is not present', () => {
      expect(() => previewImageFromBase64('data:image/png;base64,iVBORw0KGgo=')).toThrow(
        'Preview container element not found',
      );
    });
  });

  describe('getMimeTypeFromBase64', () => {
    it('when the base64 string has a data URI, it returns the mime type', () => {
      expect(getMimeTypeFromBase64({ base64String: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/png' });
      expect(getMimeTypeFromBase64({ base64String: 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/jpg' });
    });

    it('when the base64 string has no data URI, it try to infer the mime type from the signature', () => {
      // https://en.wikipedia.org/wiki/List_of_file_signatures

      // PNG
      expect(getMimeTypeFromBase64({ base64String: 'iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/png' });

      // GIF
      expect(getMimeTypeFromBase64({ base64String: 'R0lGODdh' })).to.deep.equal({ mimeType: 'image/gif' });
      expect(getMimeTypeFromBase64({ base64String: 'R0lGODlh' })).to.deep.equal({ mimeType: 'image/gif' });

      // JPG
      expect(getMimeTypeFromBase64({ base64String: '/9j/' })).to.deep.equal({ mimeType: 'image/jpg' });

      // PDF
      expect(getMimeTypeFromBase64({ base64String: 'JVBERi0' })).to.deep.equal({ mimeType: 'application/pdf' });
    });

    it('when the base64 string has no data URI and no signature, it returns an undefined mimeType', () => {
      expect(getMimeTypeFromBase64({ base64String: 'JVBERi' })).to.deep.equal({ mimeType: undefined });
    });
  });
});
