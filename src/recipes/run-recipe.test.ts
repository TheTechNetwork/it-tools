import type { Operation } from './recipe.types';
import { describe, expect, it } from 'vitest';
import { operationsById } from './operations';
import { runRecipe } from './run-recipe';

const upper: Operation = { id: 'upper', name: 'Upper', run: input => input.toUpperCase() };
const exclaim: Operation = {
  id: 'exclaim',
  name: 'Exclaim',
  args: [{ name: 'count', type: 'string', label: 'How many', default: '1' }],
  run: (input, { count }) => input + '!'.repeat(Number(count)),
};
function throwBoom(): string {
  throw new Error('boom');
}
const explode: Operation = { id: 'explode', name: 'Explode', run: throwBoom };
const slow: Operation = { id: 'slow', name: 'Slow', run: async input => `${input}-done` };

const registry = new Map<string, Operation>([
  ['upper', upper],
  ['exclaim', exclaim],
  ['explode', explode],
  ['slow', slow],
]);

describe('runRecipe', () => {
  it('feeds each step the output of the one before it', async () => {
    const result = await runRecipe([{ op: 'upper' }, { op: 'exclaim' }], 'hello', registry);

    expect(result.output).toBe('HELLO!');
    expect(result.ok).toBe(true);
    expect(result.steps.map(s => s.status)).toEqual(['ok', 'ok']);
  });

  it('returns the input untouched for an empty recipe', async () => {
    expect((await runRecipe([], 'hello', registry)).output).toBe('hello');
  });

  it('applies an argument default rather than passing undefined', async () => {
    const result = await runRecipe([{ op: 'exclaim' }], 'hi', registry);
    expect(result.output).toBe('hi!');
  });

  it('prefers an argument the recipe sets over the default', async () => {
    const result = await runRecipe([{ op: 'exclaim', args: { count: '3' } }], 'hi', registry);
    expect(result.output).toBe('hi!!!');
  });

  it('awaits an async operation', async () => {
    expect((await runRecipe([{ op: 'slow' }], 'x', registry)).output).toBe('x-done');
  });

  it('stops at a failing step and says which one failed', async () => {
    const result = await runRecipe([{ op: 'upper' }, { op: 'explode' }, { op: 'exclaim' }], 'hello', registry);

    expect(result.ok).toBe(false);
    expect(result.steps.map(s => s.status)).toEqual(['ok', 'failed']);
    expect(result.steps[1].error).toBe('boom');
    // what the last good step produced is still in hand, which is the point
    expect(result.output).toBe('HELLO');
    expect(result.steps[0].output).toBe('HELLO');
  });

  it('reports something thrown that is not an Error', async () => {
    // A service that rejects with a string rather than an Error should still
    // name itself in the step, not surface as "undefined".
    const rude = new Map<string, Operation>([['rude', {
      id: 'rude',
      name: 'Rude',
      // eslint-disable-next-line no-throw-literal -- throwing a non-Error is the thing under test
      run: () => { throw 'just a string'; },
    }]]);

    const result = await runRecipe([{ op: 'rude' }], 'x', rude);
    expect(result.steps[0].error).toBe('just a string');
  });

  it('reports an operation it does not know instead of silently skipping it', async () => {
    const result = await runRecipe([{ op: 'nope' }], 'hello', registry);

    expect(result.ok).toBe(false);
    expect(result.steps[0].status).toBe('unknown-operation');
    expect(result.steps[0].error).toContain('nope');
  });

  it('skips a disabled step and keeps going', async () => {
    const result = await runRecipe([{ op: 'upper', disabled: true }, { op: 'exclaim' }], 'hello', registry);

    expect(result.output).toBe('hello!');
    expect(result.steps.map(s => s.status)).toEqual(['skipped', 'ok']);
  });
});

describe('the real operations', () => {
  it('round-trips through base64 and url encoding', async () => {
    const recipe = [{ op: 'base64-encode' }, { op: 'url-encode' }];
    const encoded = await runRecipe(recipe, 'hello world?', operationsById);

    const back = await runRecipe([{ op: 'url-decode' }, { op: 'base64-decode' }], encoded.output, operationsById);
    expect(back.output).toBe('hello world?');
  });

  it('chains a format conversion into a case change', async () => {
    const result = await runRecipe(
      [{ op: 'json-to-yaml' }, { op: 'change-case', args: { style: 'upper' } }],
      '{"someKey":"value"}',
      operationsById,
    );

    expect(result.ok).toBe(true);
    expect(result.output).toContain('SOMEKEY');
  });

  it('surfaces a parse error from the operation that could not parse', async () => {
    const result = await runRecipe([{ op: 'yaml-to-json' }, { op: 'url-encode' }], '{{ not yaml', operationsById);

    expect(result.ok).toBe(false);
    expect(result.steps[0].op).toBe('yaml-to-json');
    expect(result.steps[0].status).toBe('failed');
  });

  it('rejects an unknown case style by name', async () => {
    const result = await runRecipe([{ op: 'change-case', args: { style: 'klingon' } }], 'x', operationsById);
    expect(result.steps[0].error).toContain('klingon');
  });

  it('round-trips every operation that has an inverse', async () => {
    // Each pair proves both halves of the registry wire up to a real service;
    // a typo in an import shows up here rather than the first time someone
    // builds a recipe with it.
    // The JSON pair compares parsed values rather than text: a round-trip
    // through YAML preserves the data, and the indentation the formatter picks
    // is not something this test should pin.
    const pairs: Array<[string, string, string, 'text' | 'json']> = [
      ['base64-encode', 'base64-decode', 'hello world', 'text'],
      ['url-encode', 'url-decode', 'a b&c=d', 'text'],
      ['html-escape', 'html-unescape', '<a href="x">1 & 2</a>', 'text'],
      ['json-to-yaml', 'yaml-to-json', '{"a":1,"b":["x","y"]}', 'json'],
    ];

    for (const [forward, backward, sample, compare] of pairs) {
      const there = await runRecipe([{ op: forward }], sample, operationsById);
      expect(there.ok, `${forward} failed`).toBe(true);
      expect(there.output, `${forward} did nothing`).not.toBe(sample);

      const back = await runRecipe([{ op: backward }], there.output, operationsById);
      expect(back.ok, `${backward} failed`).toBe(true);

      if (compare === 'json') {
        expect(JSON.parse(back.output), `${forward} -> ${backward}`).toEqual(JSON.parse(sample));
      }
      else {
        expect(back.output, `${forward} -> ${backward}`).toBe(sample);
      }
    }
  });

  it('offers every case style it advertises', async () => {
    const styles = operationsById.get('change-case')?.args?.[0];
    expect(styles?.type).toBe('select');

    for (const style of (styles as { options: readonly string[] }).options) {
      const result = await runRecipe([{ op: 'change-case', args: { style } }], 'some mixed Value', operationsById);
      expect(result.ok, `style ${style} failed`).toBe(true);
      expect(result.output.length, `style ${style} produced nothing`).toBeGreaterThan(0);
    }
  });

  it('gives every operation a unique id', () => {
    const ids = [...operationsById.keys()];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
