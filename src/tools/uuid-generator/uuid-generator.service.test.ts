import { describe, expect, it } from 'vitest';
import { generateUuids, isValidUuid, uuidVersions } from './uuid-generator.service';

const dnsNamespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const urlNamespace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid-generator', () => {
  describe('uuidVersions', () => {
    it('exposes the supported versions', () => {
      expect(uuidVersions).toEqual(['NIL', 'v1', 'v3', 'v4', 'v5']);
    });
  });

  describe('generateUuids', () => {
    it('generates the requested amount of uuids', () => {
      expect(generateUuids({ version: 'v4', count: 1 })).toHaveLength(1);
      expect(generateUuids({ version: 'v4', count: 10 })).toHaveLength(10);
      expect(generateUuids({ version: 'v4', count: 50 })).toHaveLength(50);
      expect(generateUuids({ version: 'v4', count: 0 })).toHaveLength(0);
    });

    it('generates a single uuid by default', () => {
      expect(generateUuids({ version: 'v4' })).toHaveLength(1);
    });

    it('generates the nil uuid for the NIL version', () => {
      expect(generateUuids({ version: 'NIL', count: 3 })).toEqual([
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000000',
      ]);
    });

    it('generates well-formed v1 uuids', () => {
      const uuids = generateUuids({ version: 'v1', count: 10 });

      for (const uuid of uuids) {
        expect(uuid).toMatch(uuidRegex);
        expect(uuid.charAt(14)).toBe('1');
      }
    });

    it('generates unique v1 uuids', () => {
      const uuids = generateUuids({ version: 'v1', count: 50 });

      expect(new Set(uuids).size).toBe(50);
    });

    it('generates well-formed and unique v4 uuids', () => {
      const uuids = generateUuids({ version: 'v4', count: 50 });

      for (const uuid of uuids) {
        expect(uuid).toMatch(uuidRegex);
        expect(uuid.charAt(14)).toBe('4');
      }

      expect(new Set(uuids).size).toBe(50);
    });

    it('generates deterministic v3 uuids from a name and a namespace', () => {
      expect(generateUuids({ version: 'v3', name: 'hello', namespace: dnsNamespace })).toEqual([
        '0bacede4-4014-3f9d-b720-173f68a1c933',
      ]);

      const [uuid] = generateUuids({ version: 'v3', name: 'hello', namespace: dnsNamespace });
      expect(uuid?.charAt(14)).toBe('3');

      const [otherNamespaceUuid] = generateUuids({ version: 'v3', name: 'hello', namespace: urlNamespace });
      expect(otherNamespaceUuid).not.toBe(uuid);
    });

    it('generates deterministic v5 uuids from a name and a namespace', () => {
      expect(generateUuids({ version: 'v5', name: 'hello', namespace: dnsNamespace })).toEqual([
        '9342d47a-1bab-5709-9869-c840b2eac501',
      ]);

      const [uuid] = generateUuids({ version: 'v5', name: 'hello', namespace: dnsNamespace });
      expect(uuid?.charAt(14)).toBe('5');
    });

    it('throws when generating a v3 or v5 uuid with an invalid namespace', () => {
      expect(() => generateUuids({ version: 'v3', name: 'hello', namespace: 'not-a-uuid' })).toThrow();
      expect(() => generateUuids({ version: 'v5', name: 'hello', namespace: '' })).toThrow();
    });
  });

  describe('isValidUuid', () => {
    it('accepts the nil uuid', () => {
      expect(isValidUuid('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    it('accepts well-formed uuids', () => {
      expect(isValidUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(isValidUuid('9342d47a-1bab-5709-9869-c840b2eac501')).toBe(true);
    });

    it('rejects malformed uuids', () => {
      expect(isValidUuid('')).toBe(false);
      expect(isValidUuid('not-a-uuid')).toBe(false);
      expect(isValidUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c')).toBe(false);
      expect(isValidUuid('6ba7b810-9dad-61d1-80b4-00c04fd430c8')).toBe(false);
      expect(isValidUuid('6ba7b810-9dad-11d1-c0b4-00c04fd430c8')).toBe(false);
      expect(isValidUuid('6BA7B810-9DAD-11D1-80B4-00C04FD430C8')).toBe(false);
    });
  });
});
