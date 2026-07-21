export { decodeUrlString, encodeUrlString };

function encodeUrlString(text: string): string {
  return encodeURIComponent(text);
}

function decodeUrlString(encoded: string): string {
  return decodeURIComponent(encoded);
}
