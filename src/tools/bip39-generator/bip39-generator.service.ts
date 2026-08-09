import { entropyToMnemonic, generateEntropy, mnemonicToEntropy } from './bip39';
import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  frenchWordList,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  portugueseWordList,
  spanishWordList,
} from './wordlists';

export type Language = keyof typeof languages;

export const languages = {
  'English': englishWordList,
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  'Czech': czechWordList,
  'French': frenchWordList,
  'Italian': italianWordList,
  'Japanese': japaneseWordList,
  'Korean': koreanWordList,
  'Portuguese': portugueseWordList,
  'Spanish': spanishWordList,
};

export function generateRandomEntropy(): string {
  return generateEntropy();
}

export function convertEntropyToMnemonic({ entropy, language }: { entropy: string; language: Language }): string {
  return entropyToMnemonic(entropy, languages[language]);
}

export function convertMnemonicToEntropy({ mnemonic, language }: { mnemonic: string; language: Language }): string {
  return mnemonicToEntropy(mnemonic, languages[language]);
}

export function isEntropyLengthValid(entropy: string): boolean {
  return entropy === '' || (entropy.length <= 32 && entropy.length >= 16 && entropy.length % 4 === 0);
}

export function isEntropyHexadecimal(entropy: string): boolean {
  return /^[a-f0-9]*$/i.test(entropy);
}
