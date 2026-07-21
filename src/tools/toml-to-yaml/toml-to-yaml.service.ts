import { parse as parseToml } from 'iarna-toml-esm';
import { stringify as stringifyYaml } from 'yaml';

export { convertTomlToYaml };

function convertTomlToYaml(rawToml: string): string {
  return stringifyYaml(parseToml(rawToml));
}
