import { describe, expect, it } from 'vitest';
import { decodeRecipe, encodeRecipe } from './recipe.serialisation';

describe('recipe serialisation', () => {
  it('round-trips a recipe', () => {
    const recipe = [
      { op: 'base64-decode', args: { urlSafe: true } },
      { op: 'change-case', args: { style: 'kebab' } },
    ];

    expect(decodeRecipe(encodeRecipe(recipe))).toEqual(recipe);
  });

  it('round-trips an empty recipe', () => {
    expect(decodeRecipe(encodeRecipe([]))).toEqual([]);
  });

  it('keeps a disabled step disabled', () => {
    const recipe = [{ op: 'url-encode', disabled: true }];
    expect(decodeRecipe(encodeRecipe(recipe))[0].disabled).toBe(true);
  });

  it('leaves out arguments nobody set, so a later default can still apply', () => {
    // A recipe that pins every default would freeze them at the moment it was
    // written; one that omits them picks up whatever the operation means today.
    expect(encodeRecipe([{ op: 'url-encode', args: {} }])).toBe(encodeRecipe([{ op: 'url-encode' }]));
  });

  it('survives characters that are not ASCII', () => {
    const recipe = [{ op: 'change-case', args: { style: 'über — ✓' } }];
    expect(decodeRecipe(encodeRecipe(recipe))).toEqual(recipe);
  });

  it('produces something URL-safe', () => {
    const encoded = encodeRecipe([{ op: 'base64-encode', args: { urlSafe: true } }]);
    expect(encoded).toBe(encodeURIComponent(encoded));
  });

  it('refuses something that is not a list of steps', () => {
    // Hand-built rather than round-tripped: encodeRecipe would reject this first,
    // and the point is that decodeRecipe does not trust what it is given.
    expect(() => decodeRecipe(btoa('{"op":"url-encode"}'))).toThrow('list of steps');
  });

  it('refuses a step with no operation, naming which one', () => {
    const encoded = btoa(JSON.stringify([{ op: 'url-encode' }, { args: {} }]));
    expect(() => decodeRecipe(encoded)).toThrow('Step 2');
  });
});
