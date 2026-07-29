import { pki } from 'node-forge';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateKeyPair } from './rsa-key-pair-generator.service';

describe('rsa-key-pair-generator', () => {
  describe('generateKeyPair', () => {
    // Small key size to keep the test fast; 2048 bits takes several seconds
    it('generates a valid PEM key pair of the requested size', async () => {
      const { publicKeyPem, privateKeyPem } = await generateKeyPair({ bits: 512 });

      expect(publicKeyPem).toMatch(/^-----BEGIN PUBLIC KEY-----/);
      expect(publicKeyPem.trim()).toMatch(/-----END PUBLIC KEY-----$/);
      expect(privateKeyPem).toMatch(/^-----BEGIN RSA PRIVATE KEY-----/);
      expect(privateKeyPem.trim()).toMatch(/-----END RSA PRIVATE KEY-----$/);

      const publicKey = pki.publicKeyFromPem(publicKeyPem);
      expect(publicKey.n.bitLength()).toBe(512);
    }, 30000);

    it('generates matching public and private keys', async () => {
      const { publicKeyPem, privateKeyPem } = await generateKeyPair({ bits: 512 });

      const publicKey = pki.publicKeyFromPem(publicKeyPem);
      const privateKey = pki.privateKeyFromPem(privateKeyPem);

      // The modulus of both keys must match for the pair to be usable
      expect(privateKey.n.toString(16)).toBe(publicKey.n.toString(16));
    }, 30000);

    it('generates a different key pair on each call', async () => {
      const [first, second] = await Promise.all([generateKeyPair({ bits: 512 }), generateKeyPair({ bits: 512 })]);

      expect(first.privateKeyPem).not.toBe(second.privateKeyPem);
    }, 30000);

    it('rejects when key generation fails (invalid bit length)', async () => {
      await expect(generateKeyPair({ bits: -8 })).rejects.toBeDefined();
    }, 30000);

    it('rejects with the error node-forge passes to its callback', async () => {
      const error = new Error('key generation failed');
      // node-forge reports async failures through the callback's error argument;
      // the service must forward that as a rejection.
      const spy = vi.spyOn(pki.rsa, 'generateKeyPair').mockImplementation((...args: unknown[]) => {
        const callback = args.find(arg => typeof arg === 'function') as (err: Error | null) => void;
        callback(error);
        return undefined as never;
      });

      await expect(generateKeyPair({ bits: 512 })).rejects.toBe(error);
      expect(spy).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
