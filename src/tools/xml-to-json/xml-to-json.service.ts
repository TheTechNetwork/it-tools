import convert from 'xml-js';

export function convertXmlToJson(rawXml: string): string {
  return JSON.stringify(convert.xml2js(rawXml, { compact: true }), null, 2);
}
