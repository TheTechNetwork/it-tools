import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import {
  macAddressValidation,
  macAddressValidationRules,
  partialMacAddressValidationRules,
  usePartialMacAddressValidation,
} from './macAddress';

const isValidMacAddress = (value: string) => Boolean(macAddressValidationRules[0].validator(value));
const isValidPartialMacAddress = (value: string) => Boolean(partialMacAddressValidationRules[0].validator(value));

describe('macAddress utils', () => {
  describe('macAddressValidationRules', () => {
    it('accepts full mac addresses with colon or dash separators', () => {
      expect(isValidMacAddress('00:1B:44:11:3A:B7')).toBe(true);
      expect(isValidMacAddress('00-1b-44-11-3a-b7')).toBe(true);
      expect(isValidMacAddress('a0:b1:c2:d3:e4:f5')).toBe(true);
    });

    it('accepts shorter mac prefixes with at least three octets', () => {
      expect(isValidMacAddress('00:1B:44')).toBe(true);
      expect(isValidMacAddress('00:1B:44:11')).toBe(true);
      expect(isValidMacAddress('00:1B:44:11:3A')).toBe(true);
    });

    it('ignores surrounding whitespace', () => {
      expect(isValidMacAddress('  00:1B:44:11:3A:B7  ')).toBe(true);
    });

    it('rejects invalid mac addresses', () => {
      expect(isValidMacAddress('')).toBe(false);
      expect(isValidMacAddress('not a mac')).toBe(false);
      expect(isValidMacAddress('001B44113AB7')).toBe(false);
      expect(isValidMacAddress('00:1B')).toBe(false);
      expect(isValidMacAddress('00:1B:44:11:3A:B7:FF')).toBe(false);
      expect(isValidMacAddress('ZZ:1B:44:11:3A:B7')).toBe(false);
      expect(isValidMacAddress('00:1B:44:11:3A:B')).toBe(false);
    });
  });

  describe('partialMacAddressValidationRules', () => {
    it('accepts empty and partial values', () => {
      expect(isValidPartialMacAddress('')).toBe(true);
      expect(isValidPartialMacAddress('f')).toBe(true);
      expect(isValidPartialMacAddress('f0')).toBe(true);
      expect(isValidPartialMacAddress('f0:')).toBe(true);
      expect(isValidPartialMacAddress('f0:1')).toBe(true);
      expect(isValidPartialMacAddress('F0:1B:44:11:3A:B7')).toBe(true);
    });

    it('accepts colon, dash, dot and space separators', () => {
      expect(isValidPartialMacAddress('f0-1b-44')).toBe(true);
      expect(isValidPartialMacAddress('f0.1b.44')).toBe(true);
      expect(isValidPartialMacAddress('f0 1b 44')).toBe(true);
    });

    it('rejects invalid partial values', () => {
      expect(isValidPartialMacAddress('g0')).toBe(false);
      expect(isValidPartialMacAddress('f0f')).toBe(false);
      expect(isValidPartialMacAddress('f0:1b:44:11:3a:b7:ff')).toBe(false);
    });
  });

  describe('macAddressValidation', () => {
    it('flags a valid mac address as valid', () => {
      const validation = macAddressValidation(ref('00:1B:44:11:3A:B7'));

      expect(validation.isValid).toBe(true);
      expect(validation.message).toBe('');
    });

    it('flags an invalid mac address with a message', () => {
      const validation = macAddressValidation(ref('nope'));

      expect(validation.isValid).toBe(false);
      expect(validation.message).toBe('Invalid MAC address');
    });

    it('updates when the source ref changes', async () => {
      const source = ref('nope');
      const validation = macAddressValidation(source);

      expect(validation.isValid).toBe(false);

      source.value = '00:1B:44:11:3A:B7';
      await nextTick();

      expect(validation.isValid).toBe(true);
    });
  });

  describe('usePartialMacAddressValidation', () => {
    it('flags a partial mac address as valid', () => {
      const validation = usePartialMacAddressValidation(ref('f0:1b'));

      expect(validation.isValid).toBe(true);
    });

    it('flags an invalid partial mac address with a message', () => {
      const validation = usePartialMacAddressValidation(ref('zz:zz'));

      expect(validation.isValid).toBe(false);
      expect(validation.message).toBe('Invalid partial MAC address');
    });
  });
});
