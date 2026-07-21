import { describe, expect, it } from 'vitest';
import { compareStringWithHash, hashString } from './bcrypt.service';

describe('bcrypt', () => {
  describe('hashString', () => {
    it('produces a well-formed bcrypt hash', () => {
      const hash = hashString({ string: 'hello', saltCount: 4 });

      expect(hash).toMatch(/^\$2[aby]\$04\$[./A-Z0-9a-z]{53}$/);
      expect(hash).toHaveLength(60);
    });

    it('encodes the salt count in the hash', () => {
      expect(hashString({ string: 'hello', saltCount: 4 })).toContain('$04$');
      expect(hashString({ string: 'hello', saltCount: 6 })).toContain('$06$');
    });

    it('hashes an empty string', () => {
      const hash = hashString({ string: '', saltCount: 4 });

      expect(hash).toHaveLength(60);
      expect(compareStringWithHash({ string: '', hash })).toBe(true);
    });

    it('produces different hashes for the same input because of the random salt', () => {
      const hashA = hashString({ string: 'hello', saltCount: 4 });
      const hashB = hashString({ string: 'hello', saltCount: 4 });

      expect(hashA).not.toBe(hashB);
    });
  });

  describe('compareStringWithHash', () => {
    it('matches a string with its hash', () => {
      const hash = hashString({ string: 'my password', saltCount: 4 });

      expect(compareStringWithHash({ string: 'my password', hash })).toBe(true);
    });

    it('does not match a different string', () => {
      const hash = hashString({ string: 'my password', saltCount: 4 });

      expect(compareStringWithHash({ string: 'not my password', hash })).toBe(false);
      expect(compareStringWithHash({ string: '', hash })).toBe(false);
    });

    it('matches against a known precomputed hash', () => {
      expect(compareStringWithHash({ string: 'hello', hash: '$2b$04$teZcCnqEnWWg/oDwn1VqZuCtWB3XOS36MlU6Abuvu/vcwxI9RNOAm' })).toBe(true);
      expect(compareStringWithHash({ string: 'goodbye', hash: '$2b$04$teZcCnqEnWWg/oDwn1VqZuCtWB3XOS36MlU6Abuvu/vcwxI9RNOAm' })).toBe(false);
    });

    it('returns false for a malformed hash', () => {
      expect(compareStringWithHash({ string: 'hello', hash: '' })).toBe(false);
      expect(compareStringWithHash({ string: 'hello', hash: 'not a bcrypt hash' })).toBe(false);
    });
  });
});
