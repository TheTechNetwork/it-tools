import { describe, expect, it } from 'vitest';
import { base64ToString, isBase64StringValid, stringToBase64 } from './base64-string-converter.service';

describe('base64-string-converter', () => {
  describe('stringToBase64', () => {
    it('encodes a string to base64', () => {
      expect(stringToBase64('Hello world!')).toBe('SGVsbG8gd29ybGQh');
      expect(stringToBase64('it-tools')).toBe('aXQtdG9vbHM=');
    });

    it('encodes an empty string to an empty base64 string', () => {
      expect(stringToBase64('')).toBe('');
    });

    it('encodes unicode strings', () => {
      expect(base64ToString(stringToBase64('héllo wörld 👋'))).toBe('héllo wörld 👋');
    });

    it('encodes with url-safe characters when makeUrlSafe is set', () => {
      expect(stringToBase64('>>>???', { makeUrlSafe: true })).toBe('Pj4-Pz8_');
      expect(stringToBase64('>>>???', { makeUrlSafe: false })).toBe('Pj4+Pz8/');
    });

    it('removes padding when makeUrlSafe is set', () => {
      expect(stringToBase64('it-tools', { makeUrlSafe: true })).toBe('aXQtdG9vbHM');
    });
  });

  describe('base64ToString', () => {
    it('decodes a base64 string', () => {
      expect(base64ToString('SGVsbG8gd29ybGQh')).toBe('Hello world!');
      expect(base64ToString('aXQtdG9vbHM=')).toBe('it-tools');
    });

    it('decodes an empty string to an empty string', () => {
      expect(base64ToString('')).toBe('');
    });

    it('trims surrounding whitespace before decoding', () => {
      expect(base64ToString('  SGVsbG8gd29ybGQh \n')).toBe('Hello world!');
    });

    it('decodes base64 strings with a data-url prefix', () => {
      expect(base64ToString('data:text/plain;base64,SGVsbG8gd29ybGQh')).toBe('Hello world!');
    });

    it('decodes url-safe base64 strings when makeUrlSafe is set', () => {
      expect(base64ToString('Pj4-Pz8_', { makeUrlSafe: true })).toBe('>>>???');
    });

    it('throws for invalid base64 strings', () => {
      expect(() => base64ToString('pas base64!')).toThrow('Incorrect base64 string');
      expect(() => base64ToString('SGVsbG8gd29ybGQ', { makeUrlSafe: false })).toThrow('Incorrect base64 string');
    });
  });

  describe('isBase64StringValid', () => {
    it('returns true for valid base64 strings', () => {
      expect(isBase64StringValid('SGVsbG8gd29ybGQh')).toBe(true);
      expect(isBase64StringValid('aXQtdG9vbHM=')).toBe(true);
      expect(isBase64StringValid('')).toBe(true);
    });

    it('returns true for valid base64 strings surrounded by whitespace', () => {
      expect(isBase64StringValid('  SGVsbG8gd29ybGQh  ')).toBe(true);
    });

    it('returns false for invalid base64 strings', () => {
      expect(isBase64StringValid('pas base64!')).toBe(false);
      expect(isBase64StringValid('SGVsbG8gd29ybGQ')).toBe(false);
    });

    it('validates url-safe base64 strings when makeUrlSafe is set', () => {
      expect(isBase64StringValid('Pj4-Pz8_', { makeUrlSafe: true })).toBe(true);
    });
  });

  describe('round trips', () => {
    it('round trips arbitrary strings', () => {
      const values = ['lorem ipsum', 'a', '{"json": true}', 'multi\nline\nstring'];

      for (const value of values) {
        expect(base64ToString(stringToBase64(value))).toBe(value);
        expect(base64ToString(stringToBase64(value, { makeUrlSafe: true }), { makeUrlSafe: true })).toBe(value);
      }
    });
  });
});
