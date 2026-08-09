import type { XMLFormatterOptions } from 'xml-formatter';
import xmlFormat from 'xml-formatter';
import { withDefaultOnError } from '@/utils/defaults';

function cleanRawXml(rawXml: string): string {
  return rawXml.trim();
}

export function formatXml(rawXml: string, options?: XMLFormatterOptions): string {
  return withDefaultOnError(() => xmlFormat(cleanRawXml(rawXml), options) ?? '', '');
}

export function isValidXML(rawXml: string): boolean {
  const cleanedRawXml = cleanRawXml(rawXml);

  if (cleanedRawXml === '') {
    return true;
  }

  try {
    xmlFormat(cleanedRawXml);
    return true;
  }
  catch {
    return false;
  }
}
