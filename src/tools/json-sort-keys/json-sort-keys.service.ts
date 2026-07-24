import JSON5 from 'json5';

export { sortJsonKeys };

interface SortOptions {
  order?: 'asc' | 'desc';
  indent?: number;
}

function sortValue(value: unknown, order: 'asc' | 'desc'): unknown {
  if (Array.isArray(value)) {
    // Preserve array order (it is significant); only sort keys within elements.
    return value.map(item => sortValue(item, order));
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      order === 'asc' ? a.localeCompare(b) : b.localeCompare(a),
    );

    return Object.fromEntries(entries.map(([key, val]) => [key, sortValue(val, order)]));
  }

  return value;
}

// Parse JSON (JSON5-tolerant) and re-serialize it with every object's keys
// sorted recursively, producing a canonical output useful for diffing.
function sortJsonKeys(json: string, { order = 'asc', indent = 2 }: SortOptions = {}): string {
  const parsed = JSON5.parse(json);
  return JSON.stringify(sortValue(parsed, order), null, indent);
}
