import type { Encoding } from '../hash-text/hash-text.service';
import { keccak_512, md5, ripemd160, sha1, sha224, sha256, sha384, sha512 } from '@awasm/noble';
import { hmac } from '@awasm/noble/hmac.js';
import { utf8ToBytes } from '@awasm/noble/utils.js';
import { formatBytes } from '../hash-text/hash-text.service';

export { algos, computeHmac };
export type { Encoding };

export type AlgoName = keyof typeof algos;

const algos = {
  MD5: md5,
  RIPEMD160: ripemd160,
  SHA1: sha1,
  // crypto-js's "SHA3" was actually Keccak; keccak_512 keeps HMAC-SHA3 output
  // identical to what the tool produced before.
  SHA3: keccak_512,
  SHA224: sha224,
  SHA256: sha256,
  SHA384: sha384,
  SHA512: sha512,
} as const;

function computeHmac({
  plainText,
  secret,
  hashFunction,
  encoding,
}: {
  plainText: string;
  secret: string;
  hashFunction: AlgoName;
  encoding: Encoding;
}): string {
  // HMAC(key = secret, message = plainText); crypto-js's Hmac* took (message, secret).
  const mac = hmac(algos[hashFunction], utf8ToBytes(secret), utf8ToBytes(plainText));
  return formatBytes(mac, encoding);
}
