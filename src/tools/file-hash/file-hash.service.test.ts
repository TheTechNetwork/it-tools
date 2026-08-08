import { describe, expect, it } from 'vitest';
import { hashFile, hashFileAll } from './file-hash.service';

describe('file-hash', () => {
  describe('hashFile', () => {
    const file = new Blob(['hello']);

    it('computes known digests for each algorithm', async () => {
      expect(await hashFile({ file, algorithm: 'MD5' })).toBe('5d41402abc4b2a76b9719d911017c592');
      expect(await hashFile({ file, algorithm: 'SHA-1' })).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
      expect(await hashFile({ file, algorithm: 'SHA-256' })).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
      expect(await hashFile({ file, algorithm: 'SHA-512' })).toBe(
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      );
    });

    it('streams the same digest regardless of chunk size', async () => {
      const big = new Blob(['a'.repeat(50_000)]);
      const whole = await hashFile({ file: big, algorithm: 'SHA-256' });
      const chunked = await hashFile({ file: big, algorithm: 'SHA-256', chunkSize: 7 });
      expect(chunked).toBe(whole);
    });

    it('hashes an empty file', async () => {
      expect(await hashFile({ file: new Blob([]), algorithm: 'SHA-256' })).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
    });

    it('reports progress ending at 1', async () => {
      let last = 0;
      await hashFile({ file, algorithm: 'SHA-256', onProgress: r => (last = r) });
      expect(last).toBe(1);
    });
  });

  describe('hashFileAll', () => {
    it('returns every algorithm for one file', async () => {
      const result = await hashFileAll({ file: new Blob(['hello']) });
      expect(result['SHA-256']).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
      expect(Object.keys(result)).toEqual(['MD5', 'SHA-1', 'SHA-256', 'SHA-512']);
    });

    it('reports overall progress ending at 1', async () => {
      let last = 0;
      await hashFileAll({ file: new Blob(['hello']), onProgress: r => (last = r) });
      expect(last).toBe(1);
    });
  });
});
