import { parse as parseToml } from 'smol-toml';
import { stringify as stringifyYaml } from 'yaml';

export { convertTomlToYaml };

function convertTomlToYaml(rawToml: string): string {
  return stringifyYaml(parseToml(rawToml));
}
