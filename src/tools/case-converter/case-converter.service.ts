import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';

export {
  toCamelCase,
  toCapitalCase,
  toConstantCase,
  toDotCase,
  toKebabCase,
  toLowerCase,
  toMockingCase,
  toNoCase,
  toPascalCase,
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toTrainCase,
  toUpperCase,
};

function toLowerCase(input: string): string {
  return input.toLocaleLowerCase();
}

function toUpperCase(input: string): string {
  return input.toLocaleUpperCase();
}

function toCamelCase(input: string): string {
  return camelCase(input);
}

function toCapitalCase(input: string): string {
  return capitalCase(input);
}

function toConstantCase(input: string): string {
  return constantCase(input);
}

function toDotCase(input: string): string {
  return dotCase(input);
}

function toTrainCase(input: string): string {
  return trainCase(input);
}

function toNoCase(input: string): string {
  return noCase(input);
}

function toKebabCase(input: string): string {
  return kebabCase(input);
}

function toPascalCase(input: string): string {
  return pascalCase(input);
}

function toPathCase(input: string): string {
  return pathCase(input);
}

function toSentenceCase(input: string): string {
  return sentenceCase(input);
}

function toSnakeCase(input: string): string {
  return snakeCase(input);
}

function toMockingCase(input: string): string {
  return input
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
}
