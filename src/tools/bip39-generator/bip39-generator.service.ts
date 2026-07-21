import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  entropyToMnemonic,
  frenchWordList,
  generateEntropy,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  mnemonicToEntropy,
  portugueseWordList,
  spanishWordList,
} from '@it-tools/bip39';

export {
  convertEntropyToMnemonic,
  convertMnemonicToEntropy,
  generateRandomEntropy,
  isEntropyHexadecimal,
  isEntropyLengthValid,
  languages,
};

export type Language = keyof typeof languages;

const languages = {
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

function generateRandomEntropy(): string {
  return generateEntropy();
}

function convertEntropyToMnemonic({ entropy, language }: { entropy: string; language: Language }): string {
  return entropyToMnemonic(entropy, languages[language]);
}

function convertMnemonicToEntropy({ mnemonic, language }: { mnemonic: string; language: Language }): string {
  return mnemonicToEntropy(mnemonic, languages[language]);
}

function isEntropyLengthValid(entropy: string): boolean {
  return entropy === '' || (entropy.length <= 32 && entropy.length >= 16 && entropy.length % 4 === 0);
}

function isEntropyHexadecimal(entropy: string): boolean {
  return /^[a-f0-9]*$/i.test(entropy);
}
