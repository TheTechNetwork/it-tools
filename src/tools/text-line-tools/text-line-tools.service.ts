export { applyLineOperations };
export type { LineOperations, SortOrder };

type SortOrder = 'none' | 'asc' | 'desc' | 'shuffle';

interface LineOperations {
  trim: boolean;
  removeEmpty: boolean;
  unique: boolean;
  sort: SortOrder;
  reverse: boolean;
  number: boolean;
}

// A deterministic-per-input shuffle: seeded from the line contents so the same
// input yields a stable order (no reliance on Math.random, which the codebase
// avoids in tests and keeps output reproducible).
function seededShuffle(lines: string[]): string[] {
  const result = [...lines];
  let seed = result.reduce((acc, line) => acc + line.length + line.charCodeAt(0), result.length) || 1;
  const random = () => {
    // Mulberry32-style PRNG.
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function applyLineOperations(text: string, operations: LineOperations): string {
  if (text === '') {
    return '';
  }

  let lines = text.split('\n');

  if (operations.trim) {
    lines = lines.map(line => line.trim());
  }

  if (operations.removeEmpty) {
    lines = lines.filter(line => line.trim() !== '');
  }

  if (operations.unique) {
    lines = [...new Set(lines)];
  }

  if (operations.sort === 'asc') {
    lines = [...lines].sort((a, b) => a.localeCompare(b));
  }
  else if (operations.sort === 'desc') {
    lines = [...lines].sort((a, b) => b.localeCompare(a));
  }
  else if (operations.sort === 'shuffle') {
    lines = seededShuffle(lines);
  }

  if (operations.reverse) {
    lines = [...lines].reverse();
  }

  if (operations.number) {
    const width = String(lines.length).length;
    lines = lines.map((line, index) => `${String(index + 1).padStart(width, ' ')}. ${line}`);
  }

  return lines.join('\n');
}
