import type { Operation, Recipe, RecipeResult, StepOutcome } from './recipe.types';

/**
 * Run a recipe over an input.
 *
 * A failing step stops the chain and is reported by name, with everything that
 * succeeded before it kept. CyberChef's equivalent leaves you to work out which
 * of a dozen steps broke; here the step that failed says so, and the output of
 * the one before it is still in hand.
 */
export async function runRecipe(
  recipe: Recipe,
  input: string,
  operations: Map<string, Operation>,
): Promise<RecipeResult> {
  const steps: StepOutcome[] = [];
  let value = input;

  for (const step of recipe) {
    if (step.disabled) {
      steps.push({ op: step.op, status: 'skipped' });
      continue;
    }

    const operation = operations.get(step.op);
    if (!operation) {
      steps.push({
        op: step.op,
        status: 'unknown-operation',
        error: `No operation named "${step.op}"`,
      });
      return { output: value, steps, ok: false };
    }

    const startedAt = performance.now();
    try {
      value = await operation.run(value, withDefaults(operation, step.args));
      steps.push({ op: step.op, status: 'ok', output: value, durationMs: performance.now() - startedAt });
    }
    catch (error) {
      steps.push({
        op: step.op,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        durationMs: performance.now() - startedAt,
      });
      return { output: value, steps, ok: false };
    }
  }

  return { output: value, steps, ok: true };
}

/**
 * A recipe stores only the arguments someone changed, so an operation that gains
 * an argument later keeps working with recipes written before it existed.
 */
function withDefaults(operation: Operation, args: Record<string, unknown> = {}): Record<string, unknown> {
  const resolved: Record<string, unknown> = { ...args };
  for (const spec of operation.args ?? []) {
    if (resolved[spec.name] === undefined && 'default' in spec && spec.default !== undefined) {
      resolved[spec.name] = spec.default;
    }
  }
  return resolved;
}
