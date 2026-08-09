import { parse as parseToml } from 'smol-toml';
import { isNotThrowing } from '@/utils/boolean';

export function convertTomlToJson(rawToml: string): string {
  return JSON.stringify(parseToml(rawToml), null, 3);
}

export function isValidToml(toml: string): boolean {
  return isNotThrowing(() => parseToml(toml));
}
