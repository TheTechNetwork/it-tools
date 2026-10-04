import type { Recipe } from './recipe.types';

/**
 * Recipes travel in the URL, which is most of why CyberChef's are useful: a
 * recipe you cannot hand to someone else is a thing you have to explain instead.
 *
 * The encoding is deliberately boring — JSON, then URL-safe base64 — so a recipe
 * can be read, diffed and hand-edited.
 */
export function encodeRecipe(recipe: Recipe): string {
  const json = JSON.stringify(recipe.map(({ op, args, disabled }) => ({
    op,
    ...(args && Object.keys(args).length > 0 ? { args } : {}),
    ...(disabled ? { disabled: true } : {}),
  })));

  return btoa(String.fromCharCode(...new TextEncoder().encode(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeRecipe(encoded: string): Recipe {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const parsed = JSON.parse(new TextDecoder().decode(bytes));

  if (!Array.isArray(parsed)) {
    throw new TypeError('A recipe must be a list of steps');
  }

  return parsed.map((step, index) => {
    if (typeof step?.op !== 'string') {
      throw new TypeError(`Step ${index + 1} has no operation`);
    }
    return { op: step.op, args: step.args, disabled: step.disabled };
  });
}
