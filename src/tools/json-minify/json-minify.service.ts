import JSON5 from 'json5';

export { minifyJson };

function minifyJson(rawJson: string): string {
  return JSON.stringify(JSON5.parse(rawJson), null, 0);
}
