import convert from '@unabandoned/xml-js';
import JSON5 from 'json5';

export function convertJsonToXml(rawJson: string): string {
  return convert.js2xml(JSON5.parse(rawJson), { compact: true });
}
