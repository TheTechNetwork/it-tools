import type { FormatOptionsWithLanguage } from 'sql-formatter';
import { format } from 'sql-formatter';

export { formatSql };

function formatSql(rawSql: string, options: FormatOptionsWithLanguage): string {
  return format(rawSql, options);
}
