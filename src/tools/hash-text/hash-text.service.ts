import { bytesToHex } from '@awasm/noble/utils.js';

export type Encoding = 'Bin' | 'Hex' | 'Base64' | 'Base64url';

export function convertHexToBin(hex: string) {
  return hex
    .trim()
    .split('')
    .map(byte => Number.parseInt(byte, 16).toString(2).padStart(4, '0'))
    .join('');
}

// Renders a raw digest (as produced by @awasm/noble) in the encoding the UI
// offers, matching what crypto-js produced for the same encodings: lowercase
// hex, standard padded Base64, and URL-safe Base64 without padding.
export function formatBytes(bytes: Uint8Array, encoding: Encoding): string {
  if (encoding === 'Hex') {
    return bytesToHex(bytes);
  }

  if (encoding === 'Bin') {
    return convertHexToBin(bytesToHex(bytes));
  }

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 = btoa(binary);

  return encoding === 'Base64url'
    ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : base64;
}
