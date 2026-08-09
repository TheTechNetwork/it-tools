import { gcm } from '@noble/ciphers/aes.js';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToUtf8, randomBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
import { scrypt } from '@noble/hashes/scrypt.js';

// Modern authenticated ciphers (AEAD): both provide confidentiality *and*
// tamper detection, so a wrong key or corrupted ciphertext fails loudly on
// decryption instead of returning garbage. This replaces the legacy crypto-js
// ciphers (AES-CBC/TripleDES/RC4/Rabbit), which are unauthenticated and, for
// RC4/3DES, cryptographically broken.
export const cipherAlgorithms = ['AES-GCM', 'ChaCha20-Poly1305'] as const;
export type CipherAlgorithm = typeof cipherAlgorithms[number];

const ALGORITHM_ID: Record<CipherAlgorithm, number> = {
  'AES-GCM': 0,
  'ChaCha20-Poly1305': 1,
};
const ALGORITHM_BY_ID = Object.fromEntries(
  Object.entries(ALGORITHM_ID).map(([name, id]) => [id, name as CipherAlgorithm]),
) as Record<number, CipherAlgorithm>;

// Self-describing binary envelope (then base64-encoded):
//   [version:1][algorithmId:1][salt:16][nonce:12][ciphertext+authTag:...]
// The version byte lets the format evolve without silently misreading old data.
const FORMAT_VERSION = 1;
const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;
const KEY_LENGTH = 32;
const HEADER_LENGTH = 2 + SALT_LENGTH + NONCE_LENGTH;

// scrypt parameters for version 1. Deliberately slow to make brute-forcing a
// weak passphrase expensive; N=2^15 is the standard "interactive" cost.
const SCRYPT_PARAMS = { N: 2 ** 15, r: 8, p: 1, dkLen: KEY_LENGTH };

function deriveKey(secret: string, salt: Uint8Array): Uint8Array {
  return scrypt(utf8ToBytes(secret), salt, SCRYPT_PARAMS);
}

function createCipher(algorithm: CipherAlgorithm, key: Uint8Array, nonce: Uint8Array) {
  return algorithm === 'AES-GCM' ? gcm(key, nonce) : chacha20poly1305(key, nonce);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encryptText({ text, secret, algorithm }: { text: string; secret: string; algorithm: CipherAlgorithm }): string {
  const salt = randomBytes(SALT_LENGTH);
  const nonce = randomBytes(NONCE_LENGTH);
  const key = deriveKey(secret, salt);
  const ciphertext = createCipher(algorithm, key, nonce).encrypt(utf8ToBytes(text));

  const envelope = new Uint8Array(HEADER_LENGTH + ciphertext.length);
  envelope[0] = FORMAT_VERSION;
  envelope[1] = ALGORITHM_ID[algorithm];
  envelope.set(salt, 2);
  envelope.set(nonce, 2 + SALT_LENGTH);
  envelope.set(ciphertext, HEADER_LENGTH);

  return bytesToBase64(envelope);
}

export function decryptText({ text, secret }: { text: string; secret: string; algorithm?: CipherAlgorithm }): string {
  if (text.trim() === '') {
    return '';
  }

  const envelope = base64ToBytes(text);
  if (envelope.length < HEADER_LENGTH || envelope[0] !== FORMAT_VERSION) {
    throw new Error('Unrecognized or unsupported ciphertext format');
  }

  const algorithm = ALGORITHM_BY_ID[envelope[1]];
  if (algorithm === undefined) {
    throw new Error('Unrecognized or unsupported ciphertext format');
  }

  const salt = envelope.slice(2, 2 + SALT_LENGTH);
  const nonce = envelope.slice(2 + SALT_LENGTH, HEADER_LENGTH);
  const ciphertext = envelope.slice(HEADER_LENGTH);
  const key = deriveKey(secret, salt);

  // The AEAD tag check throws on a wrong key or tampered ciphertext.
  return bytesToUtf8(createCipher(algorithm, key, nonce).decrypt(ciphertext));
}
