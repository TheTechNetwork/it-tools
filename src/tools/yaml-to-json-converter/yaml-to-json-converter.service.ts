import { parse as parseYaml } from 'yaml';

export function convertYamlToJson(rawYaml: string): string {
  const obj = parseYaml(rawYaml, { merge: true });
  return obj ? JSON.stringify(obj, null, 3) : '';
}
