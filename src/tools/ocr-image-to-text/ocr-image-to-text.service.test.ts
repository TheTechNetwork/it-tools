import { describe, expect, it, vi } from 'vitest';

const { createWorker, recognize, terminate } = vi.hoisted(() => {
  const recognize = vi.fn(async () => ({ data: { text: 'hello world' } }));
  const terminate = vi.fn(async () => {});
  const createWorker = vi.fn(async () => ({ recognize, terminate }));
  return { createWorker, recognize, terminate };
});

vi.mock('tesseract.js', () => ({ createWorker }));

const { getAssetsBaseUrl, recognizeText, SUPPORTED_LANGUAGES } = await import('./ocr-image-to-text.service');

describe('ocr-image-to-text', () => {
  it('exposes a same-origin asset base url versioned by the tesseract.js version', () => {
    expect(getAssetsBaseUrl()).toMatch(/^\/tesseract\/\d+\.\d+\.\d+$/);
  });

  it('offers a broad language set including English', () => {
    expect(SUPPORTED_LANGUAGES.find(language => language.code === 'eng')?.name).toBe('English');
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(20);
  });

  it('recognizes text through a worker built from the versioned asset paths', async () => {
    const text = await recognizeText({ image: 'data:image/png;base64,AAAA', languages: ['eng', 'fra'] });

    expect(text).toBe('hello world');
    // A plain (non-reactive) array must reach tesseract.js or its worker
    // postMessage fails to structured-clone it.
    expect(createWorker).toHaveBeenCalledWith(['eng', 'fra'], 1, expect.objectContaining({
      workerPath: expect.stringMatching(/\/tesseract\/.+\/worker\.min\.js$/),
      corePath: expect.stringMatching(/\/tesseract\/.+\/core$/),
      langPath: expect.stringMatching(/\/tesseract\/.+\/tessdata$/),
      gzip: false,
    }));
    expect(recognize).toHaveBeenCalledWith('data:image/png;base64,AAAA');
    expect(terminate).toHaveBeenCalled();
  });
});
