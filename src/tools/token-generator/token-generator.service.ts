export { createToken };

function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean;
  withLowercase?: boolean;
  withNumbers?: boolean;
  withSymbols?: boolean;
  length?: number;
  alphabet?: string;
}) {
  const allAlphabet = alphabet ?? [
    withUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
    withLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
    withNumbers ? '0123456789' : '',
    withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '',
  ].join('');

  if (allAlphabet.length === 0) {
    return '';
  }

  return Array.from({ length }, () => allAlphabet.charAt(randomIndex(allAlphabet.length))).join('');
}

// Uniformly pick an integer in [0, max) using the crypto RNG. Rejection sampling
// discards the biased tail so every character is equally likely (a plain
// `value % max` would slightly favour the first `2^32 % max` characters).
function randomIndex(max: number): number {
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0] ?? 0;
  } while (value >= limit);
  return value % max;
}
