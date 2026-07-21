import type { lib } from 'crypto-js';
import {
  enc,
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA3,
  HmacSHA224,
  HmacSHA256,
  HmacSHA384,
  HmacSHA512,
} from 'crypto-js';
import { convertHexToBin } from '../hash-text/hash-text.service';

export { algos, computeHmac, formatWithEncoding };

export type AlgoName = keyof typeof algos;

export type Encoding = keyof typeof enc | 'Bin';

const algos = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
} as const;

function formatWithEncoding(words: lib.WordArray, encoding: Encoding): string {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }
  return words.toString(enc[encoding]);
}

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
  return formatWithEncoding(algos[hashFunction](plainText, secret), encoding);
}
