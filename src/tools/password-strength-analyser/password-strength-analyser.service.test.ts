import { describe, expect, it } from 'vitest';
import { getCharsetLength, getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

describe('password-strength-analyser-and-crack-time-estimation', () => {
  describe('getCharsetLength', () => {
    describe('computes the charset length of a given password', () => {
      it('the charset length is 26 when the password is only lowercase characters', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyz' })).toBe(26);
      });
      it('the charset length is 26 when the password is only uppercase characters', () => {
        expect(getCharsetLength({ password: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' })).toBe(26);
      });
      it('the charset length is 10 when the password is only digits', () => {
        expect(getCharsetLength({ password: '0123456789' })).toBe(10);
      });
      it('the charset length is 32 when the password is only special characters', () => {
        expect(getCharsetLength({ password: '-_(' })).toBe(32);
      });
      it('the charset length is 0 when the password is empty', () => {
        expect(getCharsetLength({ password: '' })).toBe(0);
      });

      it('the charset length is 36 when the password is lowercase characters and digits', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyz0123456789' })).toBe(36);
      });
      it('the charset length is 94 when the password mixes every character class', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_(' })).toBe(94);
      });
    });
  });

  describe('getPasswordCrackTimeEstimation', () => {
    it('returns a zeroed estimation for an empty password', () => {
      const result = getPasswordCrackTimeEstimation({ password: '' });

      expect(result).toEqual({
        entropy: 0,
        charsetLength: 0,
        passwordLength: 0,
        crackDurationFormatted: 'Instantly',
        secondsToCrack: 2 ** 0 / 1e9,
        score: 0,
      });
    });

    it('computes entropy from the charset length and password length', () => {
      const result = getPasswordCrackTimeEstimation({ password: 'abcdef' });

      expect(result.charsetLength).toBe(26);
      expect(result.passwordLength).toBe(6);
      expect(result.entropy).toBeCloseTo(Math.log2(26) * 6, 6);
      expect(result.secondsToCrack).toBeCloseTo(2 ** (Math.log2(26) * 6) / 1e9, 6);
    });

    it('formats a sub-millisecond crack time as "Instantly"', () => {
      expect(getPasswordCrackTimeEstimation({ password: '' }).crackDurationFormatted).toBe('Instantly');
      // Very weak, non-empty password crackable well under a millisecond.
      expect(getPasswordCrackTimeEstimation({ password: 'a' }).crackDurationFormatted).toBe('Instantly');
    });

    it('formats a crack time under a second as "Less than a second"', () => {
      expect(getPasswordCrackTimeEstimation({ password: 'abcdef' }).crackDurationFormatted).toBe('Less than a second');
    });

    it('formats crack times with two plural units', () => {
      expect(getPasswordCrackTimeEstimation({ password: 'abcdefgh' }).crackDurationFormatted).toBe('3 minutes, 28 seconds');
    });

    it('uses singular unit names for a quantity of one', () => {
      // 26^10 guesses; tuning guessesPerSecond pins the crack time exactly.
      const base = 26 ** 10;

      expect(getPasswordCrackTimeEstimation({ password: 'abcdefghij', guessesPerSecond: base / 90 }).crackDurationFormatted).toBe(
        '1 minute, 29 seconds',
      );
      expect(getPasswordCrackTimeEstimation({ password: 'abcdefghij', guessesPerSecond: base / 5000 }).crackDurationFormatted).toBe(
        '1 hour, 23 minutes',
      );
    });

    it('prettifies a small millennia count with locale grouping', () => {
      const base = 26 ** 10;

      expect(getPasswordCrackTimeEstimation({ password: 'abcdefghij', guessesPerSecond: base / 1.5e11 }).crackDurationFormatted).toBe(
        '4 millennia, 7 centuries',
      );
    });

    it('prettifies an enormous millennia count with grouped digits', () => {
      const result = getPasswordCrackTimeEstimation({ password: 'aA1!aA1!aA1!aA1!aA1!' });

      expect(result.crackDurationFormatted).toBe('91,992,085,594,704,890,000 millennia, 9 decades');
    });

    it('prettifies a millennia count in exponential notation with two decimals', () => {
      const result = getPasswordCrackTimeEstimation({ password: 'aA1!aA1!aA1!aA1!aA1!aA1!' });

      expect(result.crackDurationFormatted).toBe('7.18e+27 millennia, 2 centuries');
    });

    it('caps the score at 1 for very strong passwords', () => {
      const result = getPasswordCrackTimeEstimation({ password: 'aA1!aA1!aA1!aA1!aA1!' });

      expect(result.entropy).toBeGreaterThan(128);
      expect(result.score).toBe(1);
    });

    it('scores weaker passwords proportionally to their entropy', () => {
      const result = getPasswordCrackTimeEstimation({ password: 'abcdef' });

      expect(result.score).toBeCloseTo(result.entropy / 128, 6);
      expect(result.score).toBeLessThan(1);
    });
  });
});
