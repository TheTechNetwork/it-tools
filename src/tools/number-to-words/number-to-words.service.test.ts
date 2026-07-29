import { describe, expect, it } from 'vitest';
import { numberToWords } from './number-to-words.service';

describe('number-to-words', () => {
  it('converts single digits and zero', () => {
    expect(numberToWords(0)).toBe('zero');
    expect(numberToWords(7)).toBe('seven');
  });

  it('converts the teens and tens', () => {
    expect(numberToWords(13)).toBe('thirteen');
    expect(numberToWords(20)).toBe('twenty');
    expect(numberToWords(42)).toBe('forty-two');
  });

  it('converts hundreds', () => {
    expect(numberToWords(100)).toBe('one hundred');
    expect(numberToWords(215)).toBe('two hundred fifteen');
  });

  it('converts thousands, millions and billions', () => {
    expect(numberToWords(1000)).toBe('one thousand');
    expect(numberToWords(1234)).toBe('one thousand two hundred thirty-four');
    expect(numberToWords(1000000)).toBe('one million');
    expect(numberToWords(1000000000)).toBe('one billion');
  });

  it('skips empty groups correctly', () => {
    expect(numberToWords(1000001)).toBe('one million one');
    expect(numberToWords(2000005)).toBe('two million five');
  });

  it('handles negatives', () => {
    expect(numberToWords(-45)).toBe('minus forty-five');
    expect(numberToWords('-0')).toBe('zero');
  });

  it('reads decimals digit by digit', () => {
    expect(numberToWords('3.14')).toBe('three point one four');
    expect(numberToWords('0.5')).toBe('zero point five');
  });

  it('accepts numeric strings with leading zeros', () => {
    expect(numberToWords('007')).toBe('seven');
  });

  it('throws on invalid input', () => {
    expect(() => numberToWords('abc')).toThrow('Please enter a valid number.');
    expect(() => numberToWords('')).toThrow('Please enter a valid number.');
    expect(() => numberToWords('   ')).toThrow('Please enter a valid number.');
    expect(() => numberToWords('1.2.3')).toThrow('Please enter a valid number.');
  });

  it('accepts a leading plus sign and a bare fractional value', () => {
    expect(numberToWords('+42')).toBe('forty-two');
    expect(numberToWords('.5')).toBe('zero point five');
  });

  it('reads out large short-scale groups up to quintillion', () => {
    expect(numberToWords('1000000000000')).toBe('one trillion');
    expect(numberToWords('1000000000000000')).toBe('one quadrillion');
    expect(numberToWords('1000000000000000000')).toBe('one quintillion');
  });

  it('throws when the number exceeds the supported short-scale range', () => {
    // 22 digits => 8 three-digit groups, one beyond quintillion.
    expect(() => numberToWords('1000000000000000000000')).toThrow('Number is too large to convert.');
  });
});
