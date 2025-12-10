const random = () => Math.random();

const randFromArray = <T>(array: T[]): T => {
  const index = Math.floor(random() * array.length);
  const value = array[index];
  if (value === undefined) {
    throw new Error('Array is empty or index out of bounds');
  }
  return value;
};

const randIntFromInterval = (min: number, max: number) => Math.floor(random() * (max - min) + min);

// Durstenfeld shuffle
function shuffleArrayMutate<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    const swapValue = array[j];
    if (temp !== undefined && swapValue !== undefined) {
      array[i] = swapValue;
      array[j] = temp;
    }
  }

  return array;
}

const shuffleArray = <T>(array: T[]): T[] => shuffleArrayMutate([...array]);

const shuffleString = (str: string, delimiter = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter);

const generateRandomId = () => `id-${random().toString(36).substring(2, 12)}`;

export {
  randFromArray,
  randIntFromInterval,
  random,
  shuffleArray,
  shuffleArrayMutate,
  shuffleString,
  generateRandomId,
};
