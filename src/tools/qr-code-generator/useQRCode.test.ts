import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useQRCode } from './useQRCode';

// The qrcode library's node build produces data URLs without a real <canvas>,
// so these run under jsdom against the real generator. Generation is async, so
// we poll with vi.waitFor rather than a single nextTick.

const isPngDataUrl = /^data:image\/png;base64,/;

describe('useQRCode', () => {
  it('produces a png data url for non-empty text', async () => {
    const { qrcode } = useQRCode({
      text: ref('https://it-tools.tech'),
      color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
    });

    await vi.waitFor(() => expect(qrcode.value).toMatch(isPngDataUrl));
  });

  it('leaves the output empty when the text is empty', async () => {
    const { qrcode } = useQRCode({
      text: ref(''),
      color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
    });

    // Give the immediate watcher a chance to run; it must not populate anything.
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(qrcode.value).toBe('');
  });

  it('regenerates when the text ref changes', async () => {
    const text = ref('first');
    const { qrcode } = useQRCode({
      text,
      color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
    });

    await vi.waitFor(() => expect(qrcode.value).toMatch(isPngDataUrl));
    const first = qrcode.value;

    text.value = 'second';
    await vi.waitFor(() => expect(qrcode.value).not.toBe(first));

    expect(qrcode.value).toMatch(isPngDataUrl);
  });

  it('applies the foreground/background colors so different colors yield different output', async () => {
    const black = useQRCode({
      text: ref('same-text'),
      color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
    });
    const red = useQRCode({
      text: ref('same-text'),
      color: { foreground: ref('#ff0000ff'), background: ref('#ffffffff') },
    });

    await vi.waitFor(() => {
      expect(black.qrcode.value).toMatch(isPngDataUrl);
      expect(red.qrcode.value).toMatch(isPngDataUrl);
    });

    expect(black.qrcode.value).not.toBe(red.qrcode.value);
  });

  it('honours a reactive error correction level', async () => {
    const errorCorrectionLevel = ref<'L' | 'M' | 'Q' | 'H'>('L');
    const { qrcode } = useQRCode({
      text: ref('error-correction'),
      color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
      errorCorrectionLevel,
    });

    await vi.waitFor(() => expect(qrcode.value).toMatch(isPngDataUrl));
    const low = qrcode.value;

    errorCorrectionLevel.value = 'H';
    await vi.waitFor(() => expect(qrcode.value).not.toBe(low));

    expect(qrcode.value).toMatch(isPngDataUrl);
  });

  it('works with plain (non-ref) inputs via the immediate run', async () => {
    const { qrcode } = useQRCode({
      text: 'plain-string',
      color: { foreground: '#000000ff', background: '#ffffffff' },
    });

    await vi.waitFor(() => expect(qrcode.value).toMatch(isPngDataUrl));
  });
});
