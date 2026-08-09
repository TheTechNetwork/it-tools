export const random = () => Math.random();

export function randFromArray<T>(array: T[]): T {
  const index = Math.floor(random() * array.length);
  const value = array[index];
  if (value === undefined) {
    throw new Error('Array is empty or index out of bounds');
  }
  return value;
}

export const randIntFromInterval = (min: number, max: number) => Math.floor(random() * (max - min) + min);

// Durstenfeld shuffle
export function shuffleArrayMutate<T>(array: T[]): T[] {
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

export const shuffleArray = <T>(array: T[]): T[] => shuffleArrayMutate([...array]);

export const shuffleString = (str: string, delimiter = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter);

export const generateRandomId = () => `id-${random().toString(36).substring(2, 12)}`;
