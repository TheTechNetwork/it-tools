export { escapeString, unescapeString };

const ESCAPE_MAP: Record<string, string> = {
  '\\': '\\\\',
  '"': '\\"',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
};

// Escape a raw string into its backslash-escaped form (as it would appear
// inside a double-quoted JSON/JS string literal, without the surrounding
// quotes). Control characters below 0x20 become \uXXXX escapes.
function escapeString(input: string): string {
  let output = '';

  for (const char of input) {
    if (ESCAPE_MAP[char] !== undefined) {
      output += ESCAPE_MAP[char];
      continue;
    }

    const code = char.codePointAt(0) ?? 0;
    if (code < 0x20) {
      output += `\\u${code.toString(16).padStart(4, '0')}`;
      continue;
    }

    output += char;
  }

  return output;
}

// Reverse of escapeString: turn a backslash-escaped string back into its raw
// form. Supports \\, \", \/, \b, \f, \n, \r, \t, \uXXXX and \xXX escapes.
function unescapeString(input: string): string {
  let output = '';
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char !== '\\') {
      output += char;
      i += 1;
      continue;
    }

    const next = input[i + 1];

    switch (next) {
      case '\\':
        output += '\\';
        i += 2;
        break;
      case '"':
        output += '"';
        i += 2;
        break;
      case '\'':
        output += '\'';
        i += 2;
        break;
      case '/':
        output += '/';
        i += 2;
        break;
      case 'b':
        output += '\b';
        i += 2;
        break;
      case 'f':
        output += '\f';
        i += 2;
        break;
      case 'n':
        output += '\n';
        i += 2;
        break;
      case 'r':
        output += '\r';
        i += 2;
        break;
      case 't':
        output += '\t';
        i += 2;
        break;
      case 'u': {
        const hex = input.slice(i + 2, i + 6);
        if (/^[0-9a-f]{4}$/i.test(hex)) {
          output += String.fromCharCode(Number.parseInt(hex, 16));
          i += 6;
        }
        else {
          output += next;
          i += 2;
        }
        break;
      }
      case 'x': {
        const hex = input.slice(i + 2, i + 4);
        if (/^[0-9a-f]{2}$/i.test(hex)) {
          output += String.fromCharCode(Number.parseInt(hex, 16));
          i += 4;
        }
        else {
          output += next;
          i += 2;
        }
        break;
      }
      case undefined:
        // Trailing lone backslash.
        output += '\\';
        i += 1;
        break;
      default:
        // Unknown escape: keep the character after the backslash.
        output += next;
        i += 2;
        break;
    }
  }

  return output;
}
