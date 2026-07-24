export { numberToWords };

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// Short-scale group names, indexed by group (each group is 3 digits).
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

function threeDigitsToWords(n: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} hundred`);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    }
    else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      parts.push(ones > 0 ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
    }
  }

  return parts.join(' ');
}

function integerToWords(digits: string): string {
  let value = digits.replace(/^0+(?=\d)/, '');

  if (value === '0') {
    return 'zero';
  }

  // Split into groups of 3 from the right.
  const groups: number[] = [];
  while (value.length > 0) {
    groups.unshift(Number.parseInt(value.slice(-3), 10));
    value = value.slice(0, -3);
  }

  if (groups.length > SCALES.length) {
    throw new Error('Number is too large to convert.');
  }

  const words: string[] = [];
  groups.forEach((group, index) => {
    if (group === 0) {
      return;
    }
    const scale = SCALES[groups.length - 1 - index];
    words.push(scale ? `${threeDigitsToWords(group)} ${scale}` : threeDigitsToWords(group));
  });

  return words.join(' ');
}

// Convert a number (or numeric string) into its English words representation.
// Supports negatives and decimals; decimal digits are read out individually
// (e.g. 3.14 -> "three point one four").
function numberToWords(input: number | string): string {
  const raw = typeof input === 'number' ? input.toString() : input.trim();

  if (raw === '' || !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)) {
    throw new Error('Please enter a valid number.');
  }

  const negative = raw.startsWith('-');
  const unsigned = raw.replace(/^[+-]/, '');
  const [integerPart, decimalPart] = unsigned.split('.');

  let words = integerToWords(integerPart || '0');

  if (decimalPart !== undefined && decimalPart.length > 0) {
    const decimalWords = decimalPart
      .split('')
      .map(digit => ONES[Number.parseInt(digit, 10)])
      .join(' ');
    words += ` point ${decimalWords}`;
  }

  return negative && words !== 'zero' ? `minus ${words}` : words;
}
