import JSON5 from 'json5';
import convert from 'xml-js';

export { convertJsonToXml };

function convertJsonToXml(rawJson: string): string {
  return convert.js2xml(JSON5.parse(rawJson), { compact: true });
}
