import { describe, expect, it } from 'vitest';
import { cipherAlgorithms, decryptText, encryptText } from './encryption.service';

describe('encryption', () => {
  describe('cipherAlgorithms', () => {
    it('exposes the supported authenticated ciphers', () => {
      expect(cipherAlgorithms).toEqual(['AES-GCM', 'ChaCha20-Poly1305']);
    });
  });

  describe('encryptText', () => {
    it('produces a non-empty base64 ciphertext that differs from the plaintext', () => {
      const encrypted = encryptText({ text: 'Lorem ipsum dolor sit amet', secret: 'my secret key', algorithm: 'AES-GCM' });

      expect(encrypted).not.toBe('');
      expect(encrypted).not.toBe('Lorem ipsum dolor sit amet');
      expect(encrypted).toMatch(/^[A-Z0-9+/]+=*$/i);
    });

    it('produces a different ciphertext each time (random salt and nonce)', () => {
      const args = { text: 'Lorem ipsum dolor sit amet', secret: 'my secret key', algorithm: 'AES-GCM' } as const;

      expect(encryptText(args)).not.toBe(encryptText(args));
    });
  });

  describe('round trips', () => {
    it.each(cipherAlgorithms)('encrypts and decrypts with %s', (algorithm) => {
      const text = 'Lorem ipsum dolor sit amet';
      const secret = 'my secret key';

      expect(decryptText({ text: encryptText({ text, secret, algorithm }), secret })).toBe(text);
    });

    it('round trips an empty string', () => {
      const encrypted = encryptText({ text: '', secret: 'secret', algorithm: 'AES-GCM' });

      expect(decryptText({ text: encrypted, secret: 'secret' })).toBe('');
    });

    it('round trips unicode content', () => {
      const text = 'héllo wörld 👋 中文';
      const encrypted = encryptText({ text, secret: 'secret', algorithm: 'ChaCha20-Poly1305' });

      expect(decryptText({ text: encrypted, secret: 'secret' })).toBe(text);
    });
  });

  describe('decryptText', () => {
    it('returns an empty string for empty input', () => {
      expect(decryptText({ text: '', secret: 'secret' })).toBe('');
      expect(decryptText({ text: '   ', secret: 'secret' })).toBe('');
    });

    it('throws when decrypting with the wrong key', () => {
      const encrypted = encryptText({ text: 'Lorem ipsum', secret: 'my secret key', algorithm: 'AES-GCM' });

      expect(() => decryptText({ text: encrypted, secret: 'wrong key' })).toThrow();
    });

    it('throws when the ciphertext has been tampered with', () => {
      const encrypted = encryptText({ text: 'Lorem ipsum', secret: 'my secret key', algorithm: 'AES-GCM' });
      const tampered = `${encrypted.slice(0, -2)}${encrypted[encrypted.length - 2] === 'A' ? 'B' : 'A'}=`;

      expect(() => decryptText({ text: tampered, secret: 'my secret key' })).toThrow();
    });

    it('throws on an unrecognized ciphertext format', () => {
      // A valid base64 string that is too short / has an unknown version byte.
      expect(() => decryptText({ text: 'AAAA', secret: 'secret' })).toThrow('Unrecognized or unsupported ciphertext format');
    });

    it('rejects an unknown algorithm id in the envelope', () => {
      // version=1, algorithmId=99, followed by enough bytes to clear the header.
      const envelope = new Uint8Array(31);
      envelope[0] = 1;
      envelope[1] = 99;
      let binary = '';
      for (const byte of envelope) {
        binary += String.fromCharCode(byte);
      }
      expect(() => decryptText({ text: btoa(binary), secret: 'secret' })).toThrow('Unrecognized or unsupported ciphertext format');
    });
  });
});
