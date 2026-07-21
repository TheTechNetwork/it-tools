import { describe, expect, it } from 'vitest';
import { algos, computeHmac } from './hmac-generator.service';

describe('hmac-generator', () => {
  describe('algos', () => {
    it('exposes the supported hash functions', () => {
      expect(Object.keys(algos)).toEqual([
        'MD5',
        'RIPEMD160',
        'SHA1',
        'SHA3',
        'SHA224',
        'SHA256',
        'SHA384',
        'SHA512',
      ]);
    });
  });

  describe('computeHmac', () => {
    const plainText = 'The quick brown fox jumps over the lazy dog';
    const secret = 'key';

    it('computes known hex vectors for each hash function', () => {
      const expectedHexByAlgo: Record<keyof typeof algos, string> = {
        MD5: '80070713463e7749b90c2dc24911e275',
        RIPEMD160: '50278a77d4d7670561ab72e867383aef6ce50b3e',
        SHA1: 'de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9',
        SHA3: '22fb03b3391bc0adfc73c18e0919d9f142390e81d6cc2689716ac53ab75458a718059d58cfbb23c6a416c32b8afa84a9a7a9d852312a743bef0a55148e5a1b8a',
        SHA224: '88ff8b54675d39b8f72322e65ff945c52d96379988ada25639747e69',
        SHA256: 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
        SHA384: 'd7f4727e2c0b39ae0f1e40cc96f60242d5b7801841cea6fc592c5d3e1ae50700582a96cf35e1e554995fe4e03381c237',
        SHA512: 'b42af09057bac1e2d41708e48a902e09b5ff7f12ab428a4fe86653c73dd248fb82f948a549f7b791a5b41915ee4d1ec3935357e4e2317250d0372afa2ebeeb3a',
      };

      for (const [hashFunction, expected] of Object.entries(expectedHexByAlgo)) {
        expect(computeHmac({ plainText, secret, hashFunction: hashFunction as keyof typeof algos, encoding: 'Hex' })).toBe(expected);
      }
    });

    it('computes the hmac of empty text and secret', () => {
      expect(computeHmac({ plainText: '', secret: '', hashFunction: 'SHA256', encoding: 'Hex' })).toBe(
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad',
      );
    });

    it('formats the result in base64', () => {
      expect(computeHmac({ plainText, secret, hashFunction: 'SHA256', encoding: 'Base64' })).toBe(
        '97yD9DBThCSxMpjmqm+xQ+9NWaFJRhdZl0edvC0aPNg=',
      );
    });

    it('formats the result in url-safe base64', () => {
      expect(computeHmac({ plainText, secret, hashFunction: 'SHA256', encoding: 'Base64url' })).toBe(
        '97yD9DBThCSxMpjmqm-xQ-9NWaFJRhdZl0edvC0aPNg',
      );
    });

    it('formats the result in binary', () => {
      const binary = computeHmac({ plainText: '', secret: '', hashFunction: 'MD5', encoding: 'Bin' });

      expect(binary).toMatch(/^[01]{128}$/);
      expect(binary.slice(0, 8)).toBe(
        Number.parseInt(
          computeHmac({ plainText: '', secret: '', hashFunction: 'MD5', encoding: 'Hex' }).slice(0, 2),
          16,
        )
          .toString(2)
          .padStart(8, '0'),
      );
    });

    it('produces different hmacs for different secrets', () => {
      const hmacA = computeHmac({ plainText, secret: 'key-a', hashFunction: 'SHA256', encoding: 'Hex' });
      const hmacB = computeHmac({ plainText, secret: 'key-b', hashFunction: 'SHA256', encoding: 'Hex' });

      expect(hmacA).not.toBe(hmacB);
    });
  });
});
