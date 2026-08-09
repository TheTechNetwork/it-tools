import { escape, unescape } from 'lodash';

export function escapeHtmlEntities(input: string): string {
  return escape(input);
}

export function unescapeHtmlEntities(input: string): string {
  return unescape(input);
}
