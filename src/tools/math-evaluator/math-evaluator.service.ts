import { evaluate } from 'mathjs';

export function evaluateMathExpression(expression: string) {
  return evaluate(expression) ?? '';
}
