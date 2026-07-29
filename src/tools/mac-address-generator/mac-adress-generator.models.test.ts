import { describe, expect, it } from 'vitest';
import { generateRandomMacAddress, splitPrefix } from './mac-adress-generator.models';

describe('mac-adress-generator models', () => {
  describe('splitPrefix', () => {
    it('a mac address prefix is splitted around non hex characters', () => {
      expect(splitPrefix('')).toEqual([]);
      expect(splitPrefix('01')).toEqual(['01']);
      expect(splitPrefix('01:')).toEqual(['01']);
      expect(splitPrefix('01:23')).toEqual(['01', '23']);
      expect(splitPrefix('01-23')).toEqual(['01', '23']);
    });

    it('when a prefix contains only hex characters, they are grouped by 2', () => {
      expect(splitPrefix('0123')).toEqual(['01', '23']);
      expect(splitPrefix('012345')).toEqual(['01', '23', '45']);
      expect(splitPrefix('0123456')).toEqual(['01', '23', '45', '06']);
    });
  });

  describe('generateRandomMacAddress', () => {
    const createRandomByteGenerator = () => {
      let i = 0;
      return () => (i++).toString(16).padStart(2, '0');
    };

    it('generates a random mac address', () => {
      expect(generateRandomMacAddress({ getRandomByte: createRandomByteGenerator() })).toBe('00:01:02:03:04:05');
    });

    it('generates a random mac address with a prefix', () => {
      expect(generateRandomMacAddress({ prefix: 'ff:ee:aa', getRandomByte: createRandomByteGenerator() })).toBe('ff:ee:aa:00:01:02');
      expect(generateRandomMacAddress({ prefix: 'ff:ee:a', getRandomByte: createRandomByteGenerator() })).toBe('ff:ee:0a:00:01:02');
    });

    it('generates a random mac address with a prefix and a different separator', () => {
      expect(generateRandomMacAddress({ prefix: 'ff-ee-aa', separator: '-', getRandomByte: createRandomByteGenerator() })).toBe('ff-ee-aa-00-01-02');
      expect(generateRandomMacAddress({ prefix: 'ff:ee:aa', separator: '-', getRandomByte: createRandomByteGenerator() })).toBe('ff-ee-aa-00-01-02');
      expect(generateRandomMacAddress({ prefix: 'ff-ee:aa', separator: '-', getRandomByte: createRandomByteGenerator() })).toBe('ff-ee-aa-00-01-02');
      expect(generateRandomMacAddress({ prefix: 'ff ee:aa', separator: '-', getRandomByte: createRandomByteGenerator() })).toBe('ff-ee-aa-00-01-02');
    });

    it('uses default options (real random byte generator, colon separator, no prefix) when called with no arguments', () => {
      const mac = generateRandomMacAddress();

      expect(mac).toMatch(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/);
      expect(mac.split(':')).toHaveLength(6);
    });

    it('uses defaults when called with an empty options object', () => {
      const mac = generateRandomMacAddress({});

      expect(mac).toMatch(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/);
    });

    it('produces the full six bytes with the default byte generator even with a prefix', () => {
      const mac = generateRandomMacAddress({ prefix: 'aa:bb' });

      expect(mac).toMatch(/^aa:bb(:[0-9a-f]{2}){4}$/);
      expect(mac.split(':')).toHaveLength(6);
    });
  });
});
