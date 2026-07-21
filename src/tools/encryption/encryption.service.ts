import { AES, enc, Rabbit, RC4, TripleDES } from 'crypto-js';

export { algos, decryptText, encryptText };

export type AlgoName = keyof typeof algos;

const algos = { AES, TripleDES, Rabbit, RC4 };

function encryptText({ text, secret, algo }: { text: string; secret: string; algo: AlgoName }): string {
  return algos[algo].encrypt(text, secret).toString();
}

function decryptText({ text, secret, algo }: { text: string; secret: string; algo: AlgoName }): string {
  return algos[algo].decrypt(text, secret).toString(enc.Utf8);
}
