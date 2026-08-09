import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';

export function stringToBase64(text: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): string {
  return textToBase64(text, { makeUrlSafe });
}

export function base64ToString(base64: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): string {
  return base64ToText(base64.trim(), { makeUrlSafe });
}

export function isBase64StringValid(base64: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): boolean {
  return isValidBase64(base64.trim(), { makeUrlSafe });
}
