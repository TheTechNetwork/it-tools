import { describe, expect, it } from 'vitest';
import { createQRCodeDataUrl } from './qr-code-generator.service';

describe('qr-code-generator', () => {
  describe('createQRCodeDataUrl', () => {
    it('returns a png data url', async () => {
      const dataUrl = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
        errorCorrectionLevel: 'medium',
      });

      expect(dataUrl).toMatch(/^data:image\/png;base64,[A-Z0-9+/]+=*$/i);
    });

    it('trims the text before encoding it', async () => {
      const trimmed = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
      });
      const untrimmed = await createQRCodeDataUrl({
        text: '  https://it-tools.tech  ',
        foreground: '#000000ff',
        background: '#ffffffff',
      });

      expect(untrimmed).toBe(trimmed);
    });

    it('defaults to the medium error correction level', async () => {
      const withDefault = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
      });
      const withMedium = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
        errorCorrectionLevel: 'M',
      });
      const withHigh = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
        errorCorrectionLevel: 'H',
      });

      expect(withDefault).toBe(withMedium);
      expect(withHigh).not.toBe(withMedium);
    });

    it('changes the output when the colors change', async () => {
      const blackOnWhite = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#000000ff',
        background: '#ffffffff',
      });
      const whiteOnBlack = await createQRCodeDataUrl({
        text: 'https://it-tools.tech',
        foreground: '#ffffffff',
        background: '#000000ff',
      });

      expect(whiteOnBlack).not.toBe(blackOnWhite);
    });

    it('rejects on empty text', async () => {
      await expect(createQRCodeDataUrl({
        text: '',
        foreground: '#000000ff',
        background: '#ffffffff',
      })).rejects.toThrow();
    });
  });
});
