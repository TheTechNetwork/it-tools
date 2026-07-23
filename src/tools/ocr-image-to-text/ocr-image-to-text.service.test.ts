import { describe, expect, it, vi } from 'vitest';

const { createWorker, recognize, terminate } = vi.hoisted(() => {
  const recognize = vi.fn(async () => ({ data: { text: 'hello world' } }));
  const terminate = vi.fn(async () => {});
  const createWorker = vi.fn(async () => ({ recognize, terminate }));
  return { createWorker, recognize, terminate };
});

vi.mock('tesseract.js', () => ({ createWorker }));

const { createRecognizer, getAssetsBaseUrl, recognizeText, resolveAssetsBase, SUPPORTED_LANGUAGES } = await import('./ocr-image-to-text.service');

describe('ocr-image-to-text', () => {
  it('exposes a same-origin asset base url versioned by the tesseract.js version', () => {
    expect(getAssetsBaseUrl()).toMatch(/^\/tesseract\/\d+\.\d+\.\d+$/);
  });

  it('resolves the asset base: CDN in production, same-origin otherwise, override always wins', () => {
    expect(resolveAssetsBase({ prod: true })).toBe('https://assets.thetech.network');
    expect(resolveAssetsBase({ prod: false })).toBe('');
    // An explicit override wins in either mode, with trailing slashes stripped.
    expect(resolveAssetsBase({ prod: true, override: 'https://cdn.example.com/' })).toBe('https://cdn.example.com');
    expect(resolveAssetsBase({ prod: false, override: 'http://localhost:5099//' })).toBe('http://localhost:5099');
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

  it('loads tessdata_best when quality is "best"', async () => {
    createWorker.mockClear();
    await recognizeText({ image: 'x', languages: ['eng'], quality: 'best' });

    expect(createWorker).toHaveBeenCalledWith(['eng'], 1, expect.objectContaining({
      langPath: expect.stringMatching(/\/tesseract\/.+\/tessdata-best$/),
    }));
  });

  it('createRecognizer reuses one worker across recognize calls and terminates once', async () => {
    createWorker.mockClear();
    recognize.mockClear();
    terminate.mockClear();

    const recognizer = await createRecognizer({ languages: ['eng'] });
    await recognizer.recognize('a');
    await recognizer.recognize('b');
    await recognizer.terminate();

    // One worker for both images (batch), not one per image.
    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(terminate).toHaveBeenCalledTimes(1);
  });
});
