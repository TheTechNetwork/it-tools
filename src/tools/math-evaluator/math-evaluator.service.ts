import { evaluate } from 'mathjs';

export { evaluateMathExpression };

function evaluateMathExpression(expression: string) {
  return evaluate(expression) ?? '';
}
