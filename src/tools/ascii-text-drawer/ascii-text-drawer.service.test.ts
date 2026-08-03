import figlet from 'figlet';
import standardFontData from 'figlet/importable-fonts/Standard.js';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { drawAsciiArtText } from './ascii-text-drawer.service';

describe('ascii-text-drawer', () => {
  beforeAll(() => {
    // Preload the font from the figlet package so tests do not depend on network or filesystem font loading
    figlet.parseFont('Standard', standardFontData);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('drawAsciiArtText', () => {
    it('draws text as ascii art with the standard font', async () => {
      const drawn = await drawAsciiArtText({ text: 'Hi', font: 'Standard', width: 80 });

      expect(drawn).toBe(
        [
          '  _   _ _ ',
          ' | | | (_)',
          ' | |_| | |',
          ' |  _  | |',
          ' |_| |_|_|',
          '          ',
        ].join('\n'),
      );
    });

    it('produces as many lines as the font height', async () => {
      const drawn = await drawAsciiArtText({ text: 'A', font: 'Standard', width: 80 });

      expect(drawn.split('\n')).toHaveLength(6);
    });

    it('draws an empty string as empty lines', async () => {
      const drawn = await drawAsciiArtText({ text: '', font: 'Standard', width: 80 });

      expect(drawn.split('\n').every(line => line.trim() === '')).toBe(true);
    });

    it('wraps long text on multiple lines when the width is small', async () => {
      const singleLine = await drawAsciiArtText({ text: 'Hello world', font: 'Standard', width: 200 });
      const wrapped = await drawAsciiArtText({ text: 'Hello world', font: 'Standard', width: 30 });

      expect(wrapped.split('\n').length).toBeGreaterThan(singleLine.split('\n').length);
    });

    it('rejects when the font cannot be loaded', async () => {
      await expect(
        drawAsciiArtText({ text: 'Hi', font: 'ThisFontDoesNotExist', width: 80 }),
      ).rejects.toThrow();
    });

    it('resolves to an empty string when figlet yields no text', async () => {
      // figlet types the callback result as optional (string | undefined); when
      // it reports success without any drawn text, the service falls back to ''.
      vi.spyOn(figlet, 'text').mockImplementation(((
        _text: string,
        _options: unknown,
        callback: (error: Error | null, drawnText?: string) => void,
      ) => {
        callback(null, undefined);
      }) as unknown as typeof figlet.text);

      const drawn = await drawAsciiArtText({ text: 'Hi', font: 'Standard', width: 80 });

      expect(drawn).toBe('');
    });
  });
});
