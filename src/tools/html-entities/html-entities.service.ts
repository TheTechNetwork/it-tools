import { escape, unescape } from 'lodash';

export { escapeHtmlEntities, unescapeHtmlEntities };

function escapeHtmlEntities(input: string): string {
  return escape(input);
}

function unescapeHtmlEntities(input: string): string {
  return unescape(input);
}
