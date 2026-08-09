import JSON5 from 'json5';
import { JSONPath } from 'jsonpath-plus';

export { queryJson };

function queryJson({ data, query, indentSize = 2 }: { data: string; query: string; indentSize?: number }): string {
  if (data.trim() === '') {
    return '';
  }

  // JSON5 is lenient (comments, trailing commas, single quotes) so pasted
  // objects that are not strictly valid JSON still work.
  const json = JSON5.parse(data);

  const trimmedQuery = query.trim();
  if (trimmedQuery === '') {
    return JSON.stringify(json, null, indentSize);
  }

  const result = JSONPath({ path: trimmedQuery, json });

  return JSON.stringify(result, null, indentSize);
}
