import { describe, expect, it } from 'vitest';
import { algos, decryptText, encryptText } from './encryption.service';

describe('encryption', () => {
  describe('algos', () => {
    it('exposes the supported algorithms', () => {
      expect(Object.keys(algos)).toEqual(['AES', 'TripleDES', 'Rabbit', 'RC4']);
    });
  });

  describe('encryptText', () => {
    it('produces a non-empty ciphertext that differs from the plaintext', () => {
      for (const algo of Object.keys(algos) as (keyof typeof algos)[]) {
        const encrypted = encryptText({ text: 'Lorem ipsum dolor sit amet', secret: 'my secret key', algo });

        expect(encrypted).not.toBe('');
        expect(encrypted).not.toBe('Lorem ipsum dolor sit amet');
      }
    });

    it('produces a base64 ciphertext', () => {
      const encrypted = encryptText({ text: 'Lorem ipsum dolor sit amet', secret: 'my secret key', algo: 'AES' });

      expect(encrypted).toMatch(/^[A-Z0-9+/]+=*$/i);
    });
  });

  describe('decryptText', () => {
    it('decrypts a known AES ciphertext', () => {
      expect(
        decryptText({
          text: 'U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs',
          secret: 'my secret key',
          algo: 'AES',
        }),
      ).toBe('Lorem ipsum dolor sit amet');
    });

    it('throws when decrypting with the wrong key', () => {
      expect(() =>
        decryptText({
          text: 'U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs',
          secret: 'wrong key',
          algo: 'AES',
        }),
      ).toThrow('Malformed UTF-8 data');
    });
  });

  describe('round trips', () => {
    it.each(Object.keys(algos) as (keyof typeof algos)[])('encrypts and decrypts with %s', (algo) => {
      const text = 'Lorem ipsum dolor sit amet';
      const secret = 'my secret key';

      const encrypted = encryptText({ text, secret, algo });

      expect(decryptText({ text: encrypted, secret, algo })).toBe(text);
    });

    it('round trips an empty string', () => {
      const encrypted = encryptText({ text: '', secret: 'secret', algo: 'AES' });

      expect(decryptText({ text: encrypted, secret: 'secret', algo: 'AES' })).toBe('');
    });

    it('round trips unicode content', () => {
      const text = 'héllo wörld 👋 中文';
      const encrypted = encryptText({ text, secret: 'secret', algo: 'AES' });

      expect(decryptText({ text: encrypted, secret: 'secret', algo: 'AES' })).toBe(text);
    });
  });
});
