/**
 * A recipe is an ordered list of steps, each naming an operation and its
 * arguments; the output of one step is the input of the next.
 *
 * The point of the contract is that an operation's `run` is the *same* function
 * the tool's own page calls. A tool is chainable because its logic already lives
 * in a service, not because anything was rewritten for the pipeline — so the page
 * and the pipeline cannot drift apart.
 */

export type OperationArg
  = | { name: string; type: 'string'; label: string; default?: string; placeholder?: string }
    | { name: string; type: 'boolean'; label: string; default?: boolean }
    | { name: string; type: 'select'; label: string; options: readonly string[]; default?: string };

export interface Operation {
  /** Stable across releases: it is what a shared recipe stores. */
  id: string;
  name: string;
  /** Which tool this came from, so the UI can offer to open it there. */
  toolPath?: string;
  args?: readonly OperationArg[];
  run: (input: string, args: Record<string, unknown>) => string | Promise<string>;
}

export interface RecipeStep {
  op: string;
  args?: Record<string, unknown>;
  /** Steps can be muted rather than deleted while iterating on a recipe. */
  disabled?: boolean;
}

export type Recipe = RecipeStep[];

export interface StepOutcome {
  op: string;
  status: 'ok' | 'failed' | 'skipped' | 'unknown-operation';
  /** The value this step produced, kept so the UI can show where a chain went wrong. */
  output?: string;
  error?: string;
  durationMs?: number;
}

export interface RecipeResult {
  output: string;
  steps: StepOutcome[];
  ok: boolean;
}
