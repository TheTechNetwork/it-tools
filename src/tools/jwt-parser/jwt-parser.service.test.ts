import { describe, expect, it } from 'vitest';
import { decodeJwt } from './jwt-parser.service';

// Classic example token from jwt.io
// header: { alg: 'HS256', typ: 'JWT' }
// payload: { sub: '1234567890', name: 'John Doe', iat: 1516239022 }
const demoJwt
  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('jwt-parser', () => {
  describe('decodeJwt', () => {
    it('decodes the header claims', () => {
      const { header } = decodeJwt({ jwt: demoJwt });

      expect(header).toEqual([
        {
          claim: 'alg',
          claimDescription: 'Algorithm',
          value: 'HS256',
          friendlyValue: 'HMAC using SHA-256',
        },
        {
          claim: 'typ',
          claimDescription: 'Type',
          value: 'JWT',
          friendlyValue: undefined,
        },
      ]);
    });

    it('decodes the payload claims', () => {
      const { payload } = decodeJwt({ jwt: demoJwt });

      expect(payload).toContainEqual({
        claim: 'sub',
        claimDescription: 'Subject',
        value: '1234567890',
        friendlyValue: undefined,
      });
      expect(payload).toContainEqual({
        claim: 'name',
        claimDescription: 'Full name',
        value: 'John Doe',
        friendlyValue: undefined,
      });
    });

    it('formats date claims (iat, exp, nbf) with a friendly value', () => {
      const { payload } = decodeJwt({ jwt: demoJwt });

      const iat = payload.find(({ claim }) => claim === 'iat');

      expect(iat).toBeDefined();
      expect(iat!.value).toBe('1516239022');
      // Locale-dependent, so only assert it is a non-empty date-like string
      expect(iat!.friendlyValue).toMatch(/2018/);
    });

    it('stringifies object and array claim values', () => {
      // header: { alg: 'none' }, payload: { aud: ['a', 'b'] }, no signature
      const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ aud: ['a', 'b'] }))}.`;

      const { payload } = decodeJwt({ jwt });

      const aud = payload.find(({ claim }) => claim === 'aud');

      expect(aud!.value).toBe(JSON.stringify(['a', 'b'], null, 3));
    });

    it('leaves unknown claims without a description', () => {
      const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ customClaim: 'value' }))}.`;

      const { payload } = decodeJwt({ jwt });

      const custom = payload.find(({ claim }) => claim === 'customClaim');

      expect(custom).toEqual({
        claim: 'customClaim',
        claimDescription: undefined,
        value: 'value',
        friendlyValue: undefined,
      });
    });

    it('throws on an invalid jwt', () => {
      expect(() => decodeJwt({ jwt: 'not-a-jwt' })).toThrow();
      expect(() => decodeJwt({ jwt: '' })).toThrow();
    });
  });
});
