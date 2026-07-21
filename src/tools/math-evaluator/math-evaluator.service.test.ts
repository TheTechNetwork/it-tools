import { describe, expect, it } from 'vitest';
import { evaluateMathExpression } from './math-evaluator.service';

describe('math-evaluator', () => {
  describe('evaluateMathExpression', () => {
    it('evaluates basic arithmetic', () => {
      expect(evaluateMathExpression('2 + 2')).toBe(4);
      expect(evaluateMathExpression('10 - 4')).toBe(6);
      expect(evaluateMathExpression('6 * 7')).toBe(42);
      expect(evaluateMathExpression('10 / 4')).toBe(2.5);
      expect(evaluateMathExpression('2 ^ 10')).toBe(1024);
      expect(evaluateMathExpression('10 % 3')).toBe(1);
    });

    it('respects operator precedence and parentheses', () => {
      expect(evaluateMathExpression('2 + 3 * 4')).toBe(14);
      expect(evaluateMathExpression('(2 + 3) * 4')).toBe(20);
      expect(evaluateMathExpression('-(2 + 3)')).toBe(-5);
    });

    it('evaluates functions', () => {
      expect(evaluateMathExpression('sqrt(16)')).toBe(4);
      expect(evaluateMathExpression('sqrt(4) + sqrt(9)')).toBe(5);
      expect(evaluateMathExpression('sin(0)')).toBe(0);
      expect(evaluateMathExpression('sin(pi / 2)')).toBeCloseTo(1, 10);
      expect(evaluateMathExpression('cos(0)')).toBe(1);
      expect(evaluateMathExpression('abs(-5)')).toBe(5);
      expect(evaluateMathExpression('log(e)')).toBeCloseTo(1, 10);
      expect(evaluateMathExpression('2 * sqrt(6)')).toBeCloseTo(4.898979485566356, 10);
    });

    it('supports constants', () => {
      expect(evaluateMathExpression('pi')).toBeCloseTo(Math.PI, 10);
      expect(evaluateMathExpression('e')).toBeCloseTo(Math.E, 10);
    });

    it('returns an empty string for an empty expression', () => {
      expect(evaluateMathExpression('')).toBe('');
    });

    it('throws on invalid expressions', () => {
      expect(() => evaluateMathExpression('2 +')).toThrow();
      expect(() => evaluateMathExpression('unknownFunction(2)')).toThrow();
      expect(() => evaluateMathExpression('2 +* 3')).toThrow();
      expect(() => evaluateMathExpression('(2 + 3')).toThrow();
    });
  });
});
