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

    it('leaves a nil date claim without a friendly value', () => {
      // exp present but null: dateFormatter should short-circuit to undefined.
      const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ exp: null }))}.`;

      const { payload } = decodeJwt({ jwt });
      const exp = payload.find(({ claim }) => claim === 'exp');

      expect(exp).toEqual({
        claim: 'exp',
        claimDescription: 'Expiration Time',
        value: '',
        friendlyValue: undefined,
      });
    });

    it('formats exp and nbf date claims', () => {
      const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ exp: 1516239022, nbf: 1516239022 }))}.`;

      const { payload } = decodeJwt({ jwt });

      expect(payload.find(({ claim }) => claim === 'exp')!.friendlyValue).toMatch(/2018/);
      expect(payload.find(({ claim }) => claim === 'nbf')!.friendlyValue).toMatch(/2018/);
    });

    it('does not add an algorithm description when alg is not a string', () => {
      const jwt = `${btoa(JSON.stringify({ alg: 123 }))}.${btoa(JSON.stringify({ sub: 'x' }))}.`;

      const { header } = decodeJwt({ jwt });
      const alg = header.find(({ claim }) => claim === 'alg');

      expect(alg).toEqual({
        claim: 'alg',
        claimDescription: 'Algorithm',
        value: '123',
        friendlyValue: undefined,
      });
    });

    it('stringifies nested object claim values', () => {
      const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ cnf: { jkt: 'abc' } }))}.`;

      const { payload } = decodeJwt({ jwt });
      const cnf = payload.find(({ claim }) => claim === 'cnf');

      expect(cnf!.value).toBe(JSON.stringify({ jkt: 'abc' }, null, 3));
    });

    it('throws on an invalid jwt', () => {
      expect(() => decodeJwt({ jwt: 'not-a-jwt' })).toThrow();
      expect(() => decodeJwt({ jwt: '' })).toThrow();
    });
  });
});
