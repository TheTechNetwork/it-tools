import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';

export { convertYamlToToml };

function convertYamlToToml(rawYaml: string): string {
  return [stringifyToml(parseYaml(rawYaml))].flat().join('\n').trim();
}
