export { inspectString };
export type { CharacterInfo };

interface CharacterInfo {
  char: string;
  codePoint: number;
  // "U+0041" style notation.
  unicode: string;
  decimal: number;
  htmlEntity: string;
  utf8: string;
  utf16: string;
  name: string;
}

const CONTROL_NAMES: Record<number, string> = {
  0x00: 'NULL',
  0x08: 'BACKSPACE',
  0x09: 'CHARACTER TABULATION (tab)',
  0x0A: 'LINE FEED (newline)',
  0x0D: 'CARRIAGE RETURN',
  0x1B: 'ESCAPE',
  0x20: 'SPACE',
  0x7F: 'DELETE',
};

function toHex(value: number, minLength = 2): string {
  return value.toString(16).toUpperCase().padStart(minLength, '0');
}

function utf8Bytes(codePoint: number): string {
  const bytes = Array.from(new TextEncoder().encode(String.fromCodePoint(codePoint)));
  return bytes.map(byte => `0x${toHex(byte)}`).join(' ');
}

function utf16Units(char: string): string {
  const units: string[] = [];
  for (let i = 0; i < char.length; i++) {
    units.push(`0x${toHex(char.charCodeAt(i), 4)}`);
  }
  return units.join(' ');
}

function describe(codePoint: number): string {
  if (CONTROL_NAMES[codePoint] !== undefined) {
    return CONTROL_NAMES[codePoint];
  }
  if (codePoint < 0x20 || (codePoint >= 0x7F && codePoint <= 0x9F)) {
    return 'CONTROL CHARACTER';
  }
  return '';
}

// Break a string into its Unicode code points (iterating by code point handles
// surrogate pairs / emoji correctly) and describe each one.
function inspectString(input: string): CharacterInfo[] {
  return Array.from(input).map((char) => {
    const codePoint = char.codePointAt(0) ?? 0;

    return {
      char,
      codePoint,
      unicode: `U+${toHex(codePoint, 4)}`,
      decimal: codePoint,
      htmlEntity: `&#${codePoint};`,
      utf8: utf8Bytes(codePoint),
      utf16: utf16Units(char),
      name: describe(codePoint),
    };
  });
}
