import { Buffer } from 'node:buffer';
import { exportPKCS8, generateKeyPair } from 'jose';
import { describe, expect, it } from 'vitest';
import { isSymmetric, signJwt, SUPPORTED_ALGORITHMS } from './jwt-generator.service';

function decodePayload(token: string) {
  const part = token.split('.')[1] ?? '';
  return JSON.parse(Buffer.from(part, 'base64url').toString());
}

describe('jwt-generator', () => {
  it('lists the common JWT algorithms and classifies symmetric ones', () => {
    expect(SUPPORTED_ALGORITHMS).toContain('HS256');
    expect(SUPPORTED_ALGORITHMS).toContain('RS256');
    expect(SUPPORTED_ALGORITHMS).toContain('EdDSA');
    expect(isSymmetric('HS512')).toBe(true);
    expect(isSymmetric('ES256')).toBe(false);
  });

  it('signs a HS256 token from a secret whose payload round-trips', async () => {
    const token = await signJwt({
      payload: JSON.stringify({ sub: '123', name: 'Alice' }),
      algorithm: 'HS256',
      key: 'a-string-secret-at-least-256-bits-long',
    });

    expect(token.split('.')).toHaveLength(3);
    expect(decodePayload(token)).toMatchObject({ sub: '123', name: 'Alice' });
  });

  it('signs with an asymmetric private key (ES256)', async () => {
    const { privateKey } = await generateKeyPair('ES256', { extractable: true });
    const pem = await exportPKCS8(privateKey);

    const token = await signJwt({ payload: '{"sub":"42"}', algorithm: 'ES256', key: pem });

    expect(token.split('.')).toHaveLength(3);
    expect(decodePayload(token)).toMatchObject({ sub: '42' });
  });

  it('rejects invalid JSON and non-object payloads with a clear message', async () => {
    await expect(signJwt({ payload: 'not json', algorithm: 'HS256', key: 'x' })).rejects.toThrow(/not valid JSON/);
    await expect(signJwt({ payload: '[1,2,3]', algorithm: 'HS256', key: 'x' })).rejects.toThrow(/must be a JSON object/);
  });
});
