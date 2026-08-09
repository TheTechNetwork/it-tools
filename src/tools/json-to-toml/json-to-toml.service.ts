import { stringify as stringifyToml } from 'smol-toml';
import JSON5 from 'json5';

export { convertJsonToToml };

function convertJsonToToml(rawJson: string): string {
  return [stringifyToml(JSON5.parse(rawJson))].flat().join('\n').trim();
}
