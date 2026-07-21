import JSON5 from 'json5';
import { stringify as stringifyYaml } from 'yaml';

export { convertJsonToYaml };

function convertJsonToYaml(rawJson: string): string {
  return stringifyYaml(JSON5.parse(rawJson));
}
