import { stringify as stringifyToml } from 'smol-toml';
import { parse as parseYaml } from 'yaml';

export function convertYamlToToml(rawYaml: string): string {
  return [stringifyToml(parseYaml(rawYaml))].flat().join('\n').trim();
}
