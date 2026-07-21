import { parse as parseToml } from 'iarna-toml-esm';
import { isNotThrowing } from '@/utils/boolean';

export { convertTomlToJson, isValidToml };

function convertTomlToJson(rawToml: string): string {
  return JSON.stringify(parseToml(rawToml), null, 3);
}

function isValidToml(toml: string): boolean {
  return isNotThrowing(() => parseToml(toml));
}
