import type { Operation } from './recipe.types';
import { base64ToString, stringToBase64 } from '@/tools/base64-string-converter/base64-string-converter.service';
import {
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toLowerCase,
  toPascalCase,
  toSnakeCase,
  toUpperCase,
} from '@/tools/case-converter/case-converter.service';
import { escapeHtmlEntities, unescapeHtmlEntities } from '@/tools/html-entities/html-entities.service';
import { convertJsonToYaml } from '@/tools/json-to-yaml-converter/json-to-yaml-converter.service';
import { decodeUrlString, encodeUrlString } from '@/tools/url-encoder/url-encoder.service';
import { convertYamlToJson } from '@/tools/yaml-to-json-converter/yaml-to-json-converter.service';

/**
 * The chainable operations, each delegating to the service its tool already uses.
 *
 * Nothing here reimplements a transform. If an operation needs logic that does not
 * exist as a service yet, the fix is to lift it out of that tool's .vue — which is
 * worth doing anyway, because it makes the tool testable.
 *
 * Only string -> string transforms are listed. Generators take no input and so
 * cannot sit mid-chain; tools that return an object are not here yet, because how
 * a non-string hands over to the next step is a decision this prototype does not
 * need to make.
 */
export const operations: Operation[] = [
  {
    id: 'base64-encode',
    name: 'To Base64',
    toolPath: '/base64-string-converter',
    args: [{ name: 'urlSafe', type: 'boolean', label: 'URL-safe', default: false }],
    run: (input, { urlSafe }) => stringToBase64(input, { makeUrlSafe: Boolean(urlSafe) }),
  },
  {
    id: 'base64-decode',
    name: 'From Base64',
    toolPath: '/base64-string-converter',
    args: [{ name: 'urlSafe', type: 'boolean', label: 'URL-safe', default: false }],
    run: (input, { urlSafe }) => base64ToString(input, { makeUrlSafe: Boolean(urlSafe) }),
  },
  {
    id: 'url-encode',
    name: 'URL encode',
    toolPath: '/url-encoder',
    run: input => encodeUrlString(input),
  },
  {
    id: 'url-decode',
    name: 'URL decode',
    toolPath: '/url-encoder',
    run: input => decodeUrlString(input),
  },
  {
    id: 'html-escape',
    name: 'Escape HTML entities',
    toolPath: '/html-entities',
    run: input => escapeHtmlEntities(input),
  },
  {
    id: 'html-unescape',
    name: 'Unescape HTML entities',
    toolPath: '/html-entities',
    run: input => unescapeHtmlEntities(input),
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    toolPath: '/json-to-yaml-converter',
    run: input => convertJsonToYaml(input),
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    toolPath: '/yaml-to-json-converter',
    run: input => convertYamlToJson(input),
  },
  {
    id: 'change-case',
    name: 'Change case',
    toolPath: '/case-converter',
    args: [{
      name: 'style',
      type: 'select',
      label: 'Style',
      options: ['lower', 'upper', 'camel', 'pascal', 'kebab', 'snake', 'constant'],
      default: 'kebab',
    }],
    run: (input, { style }) => {
      const convert = {
        lower: toLowerCase,
        upper: toUpperCase,
        camel: toCamelCase,
        pascal: toPascalCase,
        kebab: toKebabCase,
        snake: toSnakeCase,
        constant: toConstantCase,
      }[String(style)];

      if (!convert) {
        throw new Error(`Unknown case style "${String(style)}"`);
      }
      return convert(input);
    },
  },
];

export const operationsById: Map<string, Operation> = new Map(operations.map(op => [op.id, op]));
