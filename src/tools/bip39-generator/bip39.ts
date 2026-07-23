import type { WordList } from './wordlists';
// BIP39 mnemonic <-> entropy, vendored from the (unmaintained) @it-tools/bip39
// package (MIT, CorentinTh) to drop the abandoned dependency while keeping the
// tool's exact behaviour. The only substitutions are the hash source
// (@noble/hashes instead of js-sha256) and the CSPRNG (Web Crypto instead of
// nanoid); the algorithm and its non-standard 64-128 bit entropy range are
// unchanged. Note the entropy is handled as a hex string whose *string length*
// (16-32 chars) is validated, matching the original.
import { sha256 } from '@noble/hashes/sha2.js';

export { entropyToMnemonic, generateEntropy, mnemonicToEntropy, validateEntropyLength };

function validateEntropyLength(length: number): void {
  if (length < 16) {
    throw new Error('[bip39] Invalid entropy: the length of the entropy string should be >= 16 ');
  }
  if (length > 32) {
    throw new Error('[bip39] Invalid entropy: the length of the entropy string should be <= 32');
  }
  if (length % 4 !== 0) {
    throw new Error('[bip39] Invalid entropy: the length of the entropy string should be a multiple of 4');
  }
}

function generateEntropy(length = 32): string {
  validateEntropyLength(length);

  const bytes = new Uint8Array(length / 2);
  globalThis.crypto.getRandomValues(bytes);

  return bytesToHexString(bytes);
}

function entropyToMnemonic(entropy: string, wordList: WordList): string {
  validateEntropyLength(entropy.length);

  if (!entropy.match(/^[a-z0-9]+$/i)) {
    throw new Error('[bip39] Invalid entropy: it should be an hexadecimal string (char from: [a-zA-Z0-9])');
  }

  const bytes = getByteArrayFromHexString(entropy);

  return ((bytesToBinary(bytes) + getChecksumBin(bytes)).match(/.{1,11}/g) ?? [])
    .map(chunk => wordList.words[getIntegerFromBin(chunk)])
    .join(wordList.spacer);
}

function mnemonicToEntropy(mnemonic: string, wordList: WordList): string {
  const bits = mnemonic
    .trim()
    .split(wordList.spacer)
    .filter(Boolean)
    .map(word => wordList.words.indexOf(word).toString(2).padStart(11, '0'))
    .join('');

  const entropyBitLength = 32 * Math.floor(bits.length / 33);
  const entropyBits = bits.slice(0, entropyBitLength);
  const checksumBits = bits.slice(entropyBitLength);

  const bytes = (entropyBits.match(/.{1,8}/g) ?? []).map(getIntegerFromBin);

  if (getChecksumBin(bytes) !== checksumBits) {
    throw new Error('[bip39] Invalid checksum.');
  }

  return bytes.map(byte => `0${(byte & 255).toString(16)}`.slice(-2)).join('');
}

function getChecksumBin(bytes: number[]): string {
  const checksumBitLength = (8 * bytes.length) / 32;

  return bytesToBinary(Array.from(sha256(Uint8Array.from(bytes)))).slice(0, checksumBitLength);
}

function getByteArrayFromHexString(hex: string): number[] {
  return (hex.match(/.{1,2}/g) ?? []).map(pair => Number.parseInt(pair, 16));
}

function bytesToBinary(bytes: number[]): string {
  return bytes.reduce((binary, byte) => binary + byte.toString(2).padStart(8, '0'), '');
}

function bytesToHexString(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function getIntegerFromBin(bin: string): number {
  return Number.parseInt(bin, 2);
}
