import JsonToTS from '@unabandoned/json-to-ts';
import JSON5 from 'json5';

export function convertJsonToTypescript(json: string, { rootName = 'RootObject' }: { rootName?: string } = {}): string {
  const parsed = JSON5.parse(json);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new TypeError('The JSON must be an object or an array to generate interfaces.');
  }

  return JsonToTS(parsed, { rootName })
    .map(interfaceString => `export ${interfaceString}`)
    .join('\n\n');
}
