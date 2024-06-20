export { textToBase64, base64ToText, isValidBase64, removePotentialDataAndMimePrefix };

function textToBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): string {
  try {
    const encoded = window.btoa(str);
    return makeUrlSafe ? makeUriSafe(encoded) : encoded;
  } catch (error) {
    throw new Error('The string to be encoded contains invalid characters.');
  }
}

function base64ToText(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): string {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  if (!isValidBase64(cleanStr, { makeUrlSafe })) {
    throw new Error('Incorrect base64 string');
  }

  try {
    return window.atob(cleanStr);
  } catch (error) {
    throw new Error('Incorrect base64 string');
  }
}

function removePotentialDataAndMimePrefix(str: string): string {
  return str.replace(/^data:.*?;base64,/, '');
}

function isValidBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}): boolean {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    return window.btoa(window.atob(cleanStr)) === cleanStr;
  } catch (err) {
    return false;
  }
}

function makeUriSafe(encoded: string): string {
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unURI(encoded: string): string {
  return encoded.replace(/-/g, '+').replace(/_/g, '/');
}
