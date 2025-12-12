export { generateNumeronym };

function generateNumeronym(word: string): string {
  const wordLength = word.length;

  if (wordLength <= 3) {
    return word;
  }

  return `${word[0]}${wordLength - 2}${word[wordLength - 1]}`;
}
