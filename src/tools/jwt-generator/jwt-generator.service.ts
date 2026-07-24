import { importPKCS8, SignJWT } from 'jose';

export { isSymmetric, signJwt, SUPPORTED_ALGORITHMS };
export type { JwtAlgorithm };

type JwtAlgorithm
  = | 'HS256' | 'HS384' | 'HS512'
    | 'RS256' | 'RS384' | 'RS512'
    | 'PS256' | 'PS384' | 'PS512'
    | 'ES256' | 'ES384' | 'ES512'
    | 'EdDSA';

const SUPPORTED_ALGORITHMS: JwtAlgorithm[] = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
  'EdDSA',
];

// HMAC algorithms sign with a shared secret; everything else needs a private key.
function isSymmetric(algorithm: string): boolean {
  return algorithm.startsWith('HS');
}

async function signJwt({
  payload,
  algorithm,
  key,
}: {
  payload: string;
  algorithm: JwtAlgorithm;
  key: string;
}): Promise<string> {
  let claims: unknown;
  try {
    claims = JSON.parse(payload);
  }
  catch {
    throw new Error('The payload is not valid JSON');
  }

  if (typeof claims !== 'object' || claims === null || Array.isArray(claims)) {
    throw new TypeError('The payload must be a JSON object');
  }

  const signingKey = isSymmetric(algorithm)
    ? new TextEncoder().encode(key)
    : await importPKCS8(key.trim(), algorithm);

  return new SignJWT(claims as Record<string, unknown>)
    .setProtectedHeader({ alg: algorithm })
    .sign(signingKey);
}
