// A small, dependency-free JSONPath evaluator.
//
// It supports the commonly used subset of JSONPath:
//   $                 root
//   .name / ['name']  child member access
//   [n] / [-n]        array index (negative counts from the end)
//   [*] / .*          wildcard (all members / all elements)
//   ..name / ..[*]    recursive descent
//   [start:end:step]  array slice
//   [?(<expr>)]       filter expression
//   [a,b] / ['a','b'] union of members / indices
//
// Filter expressions support @ (current item) and $ (root) paths, the
// comparison operators == != === !== < <= > >= , the boolean operators
// && || ! , parentheses, and number / string / boolean / null literals.
// A bare path in a filter is an existence test. No eval is used anywhere.

type Json = unknown;

interface NameSelector { type: 'name'; name: string }
interface WildcardSelector { type: 'wildcard' }
interface IndexSelector { type: 'index'; index: number }
interface SliceSelector { type: 'slice'; start?: number; end?: number; step?: number }
interface UnionSelector { type: 'union'; names: string[]; indices: number[] }
interface FilterSelector { type: 'filter'; predicate: (item: Json, root: Json) => boolean }

type Selector
  = | NameSelector
    | WildcardSelector
    | IndexSelector
    | SliceSelector
    | UnionSelector
    | FilterSelector;

interface Step { recursive: boolean; selector: Selector }

export function evaluateJsonPath({ path, json }: { path: string; json: Json }): Json[] {
  const steps = parsePath(path);

  let current: Json[] = [json];

  for (const step of steps) {
    const next: Json[] = [];

    for (const node of current) {
      const targets = step.recursive ? gatherDescendants(node) : [node];
      for (const target of targets) {
        applySelector(step.selector, target, json, next);
      }
    }

    current = next;
  }

  return current;
}

function gatherDescendants(node: Json): Json[] {
  const result: Json[] = [node];

  if (Array.isArray(node)) {
    for (const item of node) {
      result.push(...gatherDescendants(item));
    }
  }
  else if (isPlainObject(node)) {
    for (const value of Object.values(node)) {
      result.push(...gatherDescendants(value));
    }
  }

  return result;
}

function applySelector(selector: Selector, node: Json, root: Json, out: Json[]): void {
  switch (selector.type) {
    case 'name':
      // eslint-disable-next-line e18e/prefer-object-has-own -- Object.hasOwn needs ES2022; the vitest tsconfig lib target predates it.
      if (isPlainObject(node) && Object.prototype.hasOwnProperty.call(node, selector.name)) {
        out.push(node[selector.name]);
      }
      break;

    case 'wildcard':
      if (Array.isArray(node)) {
        out.push(...node);
      }
      else if (isPlainObject(node)) {
        out.push(...Object.values(node));
      }
      break;

    case 'index':
      if (Array.isArray(node)) {
        const idx = selector.index < 0 ? node.length + selector.index : selector.index;
        if (idx >= 0 && idx < node.length) {
          out.push(node[idx]);
        }
      }
      break;

    case 'slice':
      if (Array.isArray(node)) {
        out.push(...sliceArray(node, selector));
      }
      break;

    case 'union':
      if (isPlainObject(node)) {
        for (const name of selector.names) {
          // eslint-disable-next-line e18e/prefer-object-has-own -- Object.hasOwn needs ES2022; the vitest tsconfig lib target predates it.
          if (Object.prototype.hasOwnProperty.call(node, name)) {
            out.push(node[name]);
          }
        }
      }
      if (Array.isArray(node)) {
        for (const index of selector.indices) {
          const idx = index < 0 ? node.length + index : index;
          if (idx >= 0 && idx < node.length) {
            out.push(node[idx]);
          }
        }
      }
      break;

    case 'filter':
      if (Array.isArray(node)) {
        for (const item of node) {
          if (selector.predicate(item, root)) {
            out.push(item);
          }
        }
      }
      else if (isPlainObject(node)) {
        for (const value of Object.values(node)) {
          if (selector.predicate(value, root)) {
            out.push(value);
          }
        }
      }
      break;
  }
}

function sliceArray(array: Json[], { start, end, step = 1 }: SliceSelector): Json[] {
  if (step === 0) {
    return [];
  }

  const len = array.length;
  const normalize = (value: number | undefined, fallback: number) => {
    if (value === undefined) {
      return fallback;
    }
    return value < 0 ? Math.max(len + value, 0) : Math.min(value, len);
  };

  const result: Json[] = [];

  if (step > 0) {
    const from = normalize(start, 0);
    const to = normalize(end, len);
    for (let i = from; i < to; i += step) {
      result.push(array[i]);
    }
  }
  else {
    const from = start === undefined ? len - 1 : (start < 0 ? len + start : Math.min(start, len - 1));
    const to = end === undefined ? -1 : (end < 0 ? len + end : end);
    for (let i = from; i > to; i += step) {
      if (i >= 0 && i < len) {
        result.push(array[i]);
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Path parsing
// ---------------------------------------------------------------------------

function parsePath(rawPath: string): Step[] {
  let path = rawPath.trim();

  if (path === '' || path === '$') {
    return [];
  }

  if (path.startsWith('$')) {
    path = path.slice(1);
  }

  const steps: Step[] = [];
  let i = 0;
  let recursive = false;

  while (i < path.length) {
    const char = path[i];

    if (char === '.') {
      if (path[i + 1] === '.') {
        recursive = true;
        i += 2;

        // `..[` is a recursive descent followed by a bracket selector.
        if (path[i] === '[') {
          continue;
        }

        // `..*` recursive wildcard.
        if (path[i] === '*') {
          steps.push({ recursive: true, selector: { type: 'wildcard' } });
          recursive = false;
          i += 1;
          continue;
        }

        const name = readName(path, i);
        steps.push({ recursive: true, selector: { type: 'name', name: name.value } });
        recursive = false;
        i = name.next;
        continue;
      }

      i += 1;

      if (path[i] === '*') {
        steps.push({ recursive, selector: { type: 'wildcard' } });
        recursive = false;
        i += 1;
        continue;
      }

      const name = readName(path, i);
      steps.push({ recursive, selector: { type: 'name', name: name.value } });
      recursive = false;
      i = name.next;
      continue;
    }

    if (char === '[') {
      const end = findMatchingBracket(path, i);
      const inner = path.slice(i + 1, end).trim();
      steps.push({ recursive, selector: parseBracket(inner) });
      recursive = false;
      i = end + 1;
      continue;
    }

    // Leading bare name (e.g. path written without a leading dot).
    const name = readName(path, i);
    if (name.next === i) {
      throw new Error(`Invalid JSONPath near position ${i}`);
    }
    steps.push({ recursive, selector: { type: 'name', name: name.value } });
    recursive = false;
    i = name.next;
  }

  return steps;
}

function readName(path: string, start: number): { value: string; next: number } {
  let i = start;
  while (i < path.length && !['.', '['].includes(path[i])) {
    i += 1;
  }
  return { value: path.slice(start, i), next: i };
}

function findMatchingBracket(path: string, start: number): number {
  let depth = 0;
  let quote: string | null = null;

  for (let i = start; i < path.length; i++) {
    const char = path[i];

    if (quote) {
      if (char === '\\') {
        i += 1;
      }
      else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '\'' || char === '"') {
      quote = char;
    }
    else if (char === '[') {
      depth += 1;
    }
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  throw new Error('Unbalanced brackets in JSONPath');
}

function parseBracket(inner: string): Selector {
  if (inner === '*') {
    return { type: 'wildcard' };
  }

  if (inner.startsWith('?')) {
    const exprSource = inner.slice(1).trim().replace(/^\((.*)\)$/s, '$1');
    return { type: 'filter', predicate: buildPredicate(exprSource) };
  }

  // Slice, e.g. 1:3, :2, ::2
  if (inner.includes(':') && !isQuoted(inner)) {
    const [start, end, step] = inner.split(':').map(part => part.trim());
    return {
      type: 'slice',
      start: start === '' ? undefined : Number(start),
      end: end === '' || end === undefined ? undefined : Number(end),
      step: step === '' || step === undefined ? undefined : Number(step),
    };
  }

  // Union / list, e.g. 0,2 or 'a','b'
  if (inner.includes(',')) {
    const parts = splitTopLevel(inner, ',').map(part => part.trim());
    const names: string[] = [];
    const indices: number[] = [];
    for (const part of parts) {
      if (isQuoted(part)) {
        names.push(unquote(part));
      }
      else {
        indices.push(Number(part));
      }
    }
    return { type: 'union', names, indices };
  }

  if (isQuoted(inner)) {
    return { type: 'name', name: unquote(inner) };
  }

  if (/^-?\d+$/.test(inner)) {
    return { type: 'index', index: Number(inner) };
  }

  // Bare identifier inside brackets, e.g. [foo]
  return { type: 'name', name: inner };
}

// ---------------------------------------------------------------------------
// Filter expression parsing (recursive descent, no eval)
// ---------------------------------------------------------------------------

type Token
  = | { type: 'op'; value: string }
    | { type: 'paren'; value: '(' | ')' }
    | { type: 'path'; value: string }
    | { type: 'number'; value: number }
    | { type: 'string'; value: string }
    | { type: 'bool'; value: boolean }
    | { type: 'null' };

function buildPredicate(source: string): (item: Json, root: Json) => boolean {
  const tokens = tokenizeFilter(source);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseOr(): (item: Json, root: Json) => Json {
    let left = parseAnd();
    while (peek()?.type === 'op' && (peek() as any).value === '||') {
      consume();
      const right = parseAnd();
      const l = left;
      left = (item, root) => toBool(l(item, root)) || toBool(right(item, root));
    }
    return left;
  }

  function parseAnd(): (item: Json, root: Json) => Json {
    let left = parseNot();
    while (peek()?.type === 'op' && (peek() as any).value === '&&') {
      consume();
      const right = parseNot();
      const l = left;
      left = (item, root) => toBool(l(item, root)) && toBool(right(item, root));
    }
    return left;
  }

  function parseNot(): (item: Json, root: Json) => Json {
    if (peek()?.type === 'op' && (peek() as any).value === '!') {
      consume();
      const operand = parseNot();
      return (item, root) => !toBool(operand(item, root));
    }
    return parseComparison();
  }

  function parseComparison(): (item: Json, root: Json) => Json {
    const left = parsePrimary();
    const next = peek();
    if (next?.type === 'op' && ['==', '===', '!=', '!==', '<', '<=', '>', '>='].includes(next.value)) {
      consume();
      const right = parsePrimary();
      const op = next.value;
      return (item, root) => compare(op, left(item, root), right(item, root));
    }
    return left;
  }

  function parsePrimary(): (item: Json, root: Json) => Json {
    const token = peek();

    if (token?.type === 'paren' && token.value === '(') {
      consume();
      const expr = parseOr();
      const closing = consume();
      if (!closing || closing.type !== 'paren' || closing.value !== ')') {
        throw new Error('Unbalanced parentheses in filter expression');
      }
      return expr;
    }

    consume();

    switch (token?.type) {
      case 'path':
        return (item, root) => resolvePath(token.value, item, root);
      case 'number':
        return () => token.value;
      case 'string':
        return () => token.value;
      case 'bool':
        return () => token.value;
      case 'null':
        return () => null;
      default:
        throw new Error('Unexpected token in filter expression');
    }
  }

  const evaluator = parseOr();

  return (item, root) => toBool(evaluator(item, root));
}

function tokenizeFilter(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/\s/.test(char)) {
      i += 1;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      i += 1;
      continue;
    }

    const three = source.slice(i, i + 3);
    if (three === '===' || three === '!==') {
      tokens.push({ type: 'op', value: three });
      i += 3;
      continue;
    }

    const two = source.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(two)) {
      tokens.push({ type: 'op', value: two });
      i += 2;
      continue;
    }

    if (char === '<' || char === '>' || char === '!') {
      tokens.push({ type: 'op', value: char });
      i += 1;
      continue;
    }

    if (char === '@' || char === '$') {
      let j = i + 1;
      while (j < source.length && !/[\s()!=<>&|]/.test(source[j])) {
        j += 1;
      }
      tokens.push({ type: 'path', value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (char === '\'' || char === '"') {
      const quote = char;
      let j = i + 1;
      let value = '';
      while (j < source.length && source[j] !== quote) {
        if (source[j] === '\\') {
          value += source[j + 1];
          j += 2;
        }
        else {
          value += source[j];
          j += 1;
        }
      }
      tokens.push({ type: 'string', value });
      i = j + 1;
      continue;
    }

    if (/[\d.-]/.test(char)) {
      let j = i;
      while (j < source.length && /[\d.e+-]/i.test(source[j])) {
        j += 1;
      }
      tokens.push({ type: 'number', value: Number(source.slice(i, j)) });
      i = j;
      continue;
    }

    // Bare word: true / false / null
    let j = i;
    while (j < source.length && /[a-z]/i.test(source[j])) {
      j += 1;
    }
    const word = source.slice(i, j);
    if (word === 'true' || word === 'false') {
      tokens.push({ type: 'bool', value: word === 'true' });
    }
    else if (word === 'null') {
      tokens.push({ type: 'null' });
    }
    else if (word === '') {
      throw new Error(`Unexpected character '${char}' in filter expression`);
    }
    else {
      // Treat as a bare relative path fragment.
      tokens.push({ type: 'path', value: `@.${word}` });
    }
    i = j;
  }

  return tokens;
}

function resolvePath(pathExpr: string, item: Json, root: Json): Json {
  const base: Json = pathExpr.startsWith('$') ? root : item;
  const rest = pathExpr.replace(/^[@$]/, '');

  if (rest === '') {
    return base;
  }

  const segments = parsePath(rest.startsWith('.') || rest.startsWith('[') ? rest : `.${rest}`);

  let current: Json[] = [base];
  for (const step of segments) {
    const next: Json[] = [];
    for (const node of current) {
      applySelector(step.selector, node, root, next);
    }
    current = next;
  }

  if (segments.length === 0) {
    return base;
  }

  return current.length === 0 ? undefined : current[0];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function compare(op: string, left: Json, right: Json): boolean {
  switch (op) {
    case '==':
      // eslint-disable-next-line eqeqeq
      return left == right;
    case '===':
      return left === right;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return left != right;
    case '!==':
      return left !== right;
    case '<':
      return (left as any) < (right as any);
    case '<=':
      return (left as any) <= (right as any);
    case '>':
      return (left as any) > (right as any);
    case '>=':
      return (left as any) >= (right as any);
    default:
      return false;
  }
}

function toBool(value: Json): boolean {
  return value !== undefined && value !== null && value !== false;
}

function isPlainObject(value: Json): value is Record<string, Json> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isQuoted(value: string): boolean {
  return (value.startsWith('\'') && value.endsWith('\'')) || (value.startsWith('"') && value.endsWith('"'));
}

function unquote(value: string): string {
  return value.slice(1, -1);
}

function splitTopLevel(value: string, separator: string): string[] {
  const parts: string[] = [];
  let quote: string | null = null;
  let current = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      current += char;
    }
    else if (char === '\'' || char === '"') {
      quote = char;
      current += char;
    }
    else if (char === separator) {
      parts.push(current);
      current = '';
    }
    else {
      current += char;
    }
  }

  parts.push(current);
  return parts;
}
