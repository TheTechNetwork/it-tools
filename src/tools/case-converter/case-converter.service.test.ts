import { describe, expect, it } from 'vitest';
import {
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
} from './case-converter.service';

describe('case-converter', () => {
  describe('toLowerCase', () => {
    it('converts a string to lowercase', () => {
      expect(toLowerCase('Lorem Ipsum DOLOR')).toBe('lorem ipsum dolor');
    });

    it('handles an empty string', () => {
      expect(toLowerCase('')).toBe('');
    });

    it('handles unicode characters', () => {
      expect(toLowerCase('HÉLLO WÖRLD')).toBe('héllo wörld');
    });
  });

  describe('toUpperCase', () => {
    it('converts a string to uppercase', () => {
      expect(toUpperCase('lorem ipsum dolor')).toBe('LOREM IPSUM DOLOR');
    });

    it('handles an empty string', () => {
      expect(toUpperCase('')).toBe('');
    });

    it('handles unicode characters', () => {
      expect(toUpperCase('héllo wörld')).toBe('HÉLLO WÖRLD');
    });
  });

  describe('toCamelCase', () => {
    it('converts a sentence to camelCase', () => {
      expect(toCamelCase('lorem ipsum dolor sit amet')).toBe('loremIpsumDolorSitAmet');
    });

    it('handles mixed delimiters', () => {
      expect(toCamelCase('hello-world_foo bar')).toBe('helloWorldFooBar');
    });

    it('splits on existing case boundaries', () => {
      expect(toCamelCase('XMLHttpRequest')).toBe('xmlHttpRequest');
    });

    it('handles unicode characters', () => {
      expect(toCamelCase('héllo wörld')).toBe('hélloWörld');
    });

    it('handles an empty string', () => {
      expect(toCamelCase('')).toBe('');
    });
  });

  describe('toCapitalCase', () => {
    it('converts a sentence to Capital Case', () => {
      expect(toCapitalCase('lorem ipsum dolor sit amet')).toBe('Lorem Ipsum Dolor Sit Amet');
    });

    it('handles mixed delimiters', () => {
      expect(toCapitalCase('hello-world_foo bar')).toBe('Hello World Foo Bar');
    });

    it('handles unicode characters', () => {
      expect(toCapitalCase('héllo wörld')).toBe('Héllo Wörld');
    });

    it('handles an empty string', () => {
      expect(toCapitalCase('')).toBe('');
    });
  });

  describe('toConstantCase', () => {
    it('converts a sentence to CONSTANT_CASE', () => {
      expect(toConstantCase('lorem ipsum dolor sit amet')).toBe('LOREM_IPSUM_DOLOR_SIT_AMET');
    });

    it('handles mixed delimiters', () => {
      expect(toConstantCase('hello-world_foo bar')).toBe('HELLO_WORLD_FOO_BAR');
    });

    it('handles unicode characters', () => {
      expect(toConstantCase('héllo wörld')).toBe('HÉLLO_WÖRLD');
    });

    it('handles an empty string', () => {
      expect(toConstantCase('')).toBe('');
    });
  });

  describe('toDotCase', () => {
    it('converts a sentence to dot.case', () => {
      expect(toDotCase('lorem ipsum dolor sit amet')).toBe('lorem.ipsum.dolor.sit.amet');
    });

    it('handles mixed delimiters', () => {
      expect(toDotCase('hello-world_foo bar')).toBe('hello.world.foo.bar');
    });

    it('handles an empty string', () => {
      expect(toDotCase('')).toBe('');
    });
  });

  describe('toTrainCase', () => {
    it('converts a sentence to Train-Case', () => {
      expect(toTrainCase('lorem ipsum dolor sit amet')).toBe('Lorem-Ipsum-Dolor-Sit-Amet');
    });

    it('handles mixed delimiters', () => {
      expect(toTrainCase('hello-world_foo bar')).toBe('Hello-World-Foo-Bar');
    });

    it('handles an empty string', () => {
      expect(toTrainCase('')).toBe('');
    });
  });

  describe('toNoCase', () => {
    it('converts a string to no case', () => {
      expect(toNoCase('Hello World')).toBe('hello world');
    });

    it('handles mixed delimiters', () => {
      expect(toNoCase('hello-world_foo bar')).toBe('hello world foo bar');
    });

    it('handles an empty string', () => {
      expect(toNoCase('')).toBe('');
    });
  });

  describe('toKebabCase', () => {
    it('converts a sentence to kebab-case', () => {
      expect(toKebabCase('lorem ipsum dolor sit amet')).toBe('lorem-ipsum-dolor-sit-amet');
    });

    it('handles mixed delimiters', () => {
      expect(toKebabCase('hello-world_foo bar')).toBe('hello-world-foo-bar');
    });

    it('handles unicode characters', () => {
      expect(toKebabCase('héllo wörld')).toBe('héllo-wörld');
    });

    it('handles an empty string', () => {
      expect(toKebabCase('')).toBe('');
    });
  });

  describe('toPascalCase', () => {
    it('converts a sentence to PascalCase', () => {
      expect(toPascalCase('lorem ipsum dolor sit amet')).toBe('LoremIpsumDolorSitAmet');
    });

    it('handles mixed delimiters', () => {
      expect(toPascalCase('hello-world_foo bar')).toBe('HelloWorldFooBar');
    });

    it('handles an empty string', () => {
      expect(toPascalCase('')).toBe('');
    });
  });

  describe('toPathCase', () => {
    it('converts a sentence to path/case', () => {
      expect(toPathCase('lorem ipsum dolor sit amet')).toBe('lorem/ipsum/dolor/sit/amet');
    });

    it('handles mixed delimiters', () => {
      expect(toPathCase('hello-world_foo bar')).toBe('hello/world/foo/bar');
    });

    it('handles an empty string', () => {
      expect(toPathCase('')).toBe('');
    });
  });

  describe('toSentenceCase', () => {
    it('converts a string to Sentence case', () => {
      expect(toSentenceCase('lorem ipsum dolor sit amet')).toBe('Lorem ipsum dolor sit amet');
    });

    it('handles mixed delimiters', () => {
      expect(toSentenceCase('hello-world_foo bar')).toBe('Hello world foo bar');
    });

    it('handles an empty string', () => {
      expect(toSentenceCase('')).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('converts a sentence to snake_case', () => {
      expect(toSnakeCase('lorem ipsum dolor sit amet')).toBe('lorem_ipsum_dolor_sit_amet');
    });

    it('handles mixed delimiters', () => {
      expect(toSnakeCase('hello-world_foo bar')).toBe('hello_world_foo_bar');
    });

    it('handles unicode characters', () => {
      expect(toSnakeCase('héllo wörld')).toBe('héllo_wörld');
    });

    it('handles an empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });
  });

  describe('toMockingCase', () => {
    it('alternates the case of each character', () => {
      expect(toMockingCase('lorem ipsum')).toBe('LoReM IpSuM');
    });

    it('starts with an uppercase character', () => {
      expect(toMockingCase('abcd')).toBe('AbCd');
    });

    it('keeps non-letter characters in place', () => {
      expect(toMockingCase('a-b-c')).toBe('A-B-C');
    });

    it('handles an empty string', () => {
      expect(toMockingCase('')).toBe('');
    });
  });
});
