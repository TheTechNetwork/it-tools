import convert from 'xml-js';

export { convertXmlToJson };

function convertXmlToJson(rawXml: string): string {
  return JSON.stringify(convert.xml2js(rawXml, { compact: true }), null, 2);
}
