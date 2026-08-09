import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';

export function toLowerCase(input: string): string {
  return input.toLocaleLowerCase();
}

export function toUpperCase(input: string): string {
  return input.toLocaleUpperCase();
}

export function toCamelCase(input: string): string {
  return camelCase(input);
}

export function toCapitalCase(input: string): string {
  return capitalCase(input);
}

export function toConstantCase(input: string): string {
  return constantCase(input);
}

export function toDotCase(input: string): string {
  return dotCase(input);
}

export function toTrainCase(input: string): string {
  return trainCase(input);
}

export function toNoCase(input: string): string {
  return noCase(input);
}

export function toKebabCase(input: string): string {
  return kebabCase(input);
}

export function toPascalCase(input: string): string {
  return pascalCase(input);
}

export function toPascalSnakeCase(input: string): string {
  return pascalSnakeCase(input);
}

export function toPathCase(input: string): string {
  return pathCase(input);
}

export function toSentenceCase(input: string): string {
  return sentenceCase(input);
}

export function toSnakeCase(input: string): string {
  return snakeCase(input);
}

export function toMockingCase(input: string): string {
  return input
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
}
