import { natoAlphabet } from './text-to-nato-alphabet.constants';

function getLetterPositionInAlphabet({ letter }: { letter: string }) {
  return letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
}

export function textToNatoAlphabet({ text }: { text: string }) {
  return text
    .split('')
    .map((character) => {
      const alphabetIndex = getLetterPositionInAlphabet({ letter: character });
      const natoWord = natoAlphabet[alphabetIndex];

      return natoWord ?? character;
    })
    .join(' ');
}
