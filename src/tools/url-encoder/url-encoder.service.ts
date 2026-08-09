export function encodeUrlString(text: string): string {
  return encodeURIComponent(text);
}

export function decodeUrlString(encoded: string): string {
  return decodeURIComponent(encoded);
}
