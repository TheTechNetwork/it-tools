import { describe, expect, it } from 'vitest';
import {
  formatTypeToHumanReadable,
  getDefaultCountryCode,
  getFullCountryName,
  parsePhoneNumberDetails,
} from './phone-parser-and-formatter.service';

describe('phone-parser-and-formatter', () => {
  describe('formatTypeToHumanReadable', () => {
    it('maps phone number types to human readable labels', () => {
      expect(formatTypeToHumanReadable('MOBILE')).toBe('Mobile');
      expect(formatTypeToHumanReadable('FIXED_LINE')).toBe('Fixed line');
      expect(formatTypeToHumanReadable('FIXED_LINE_OR_MOBILE')).toBe('Fixed line or mobile');
      expect(formatTypeToHumanReadable('TOLL_FREE')).toBe('Toll free');
      expect(formatTypeToHumanReadable('VOIP')).toBe('VoIP');
    });

    it('returns undefined for an undefined type', () => {
      expect(formatTypeToHumanReadable(undefined)).toBe(undefined);
    });
  });

  describe('getFullCountryName', () => {
    it('returns the full country name from an iso code', () => {
      expect(getFullCountryName('FR')).toBe('France');
      expect(getFullCountryName('US')).toBe('United States');
    });

    it('returns undefined for an empty or unknown country code', () => {
      expect(getFullCountryName(undefined)).toBe(undefined);
      expect(getFullCountryName('')).toBe(undefined);
      expect(getFullCountryName('XX')).toBe(undefined);
    });
  });

  describe('getDefaultCountryCode', () => {
    it('extracts the country code from a locale', () => {
      expect(getDefaultCountryCode({ locale: 'en-US' })).toBe('US');
      expect(getDefaultCountryCode({ locale: 'en-GB' })).toBe('GB');
      expect(getDefaultCountryCode({ locale: 'fr-FR' })).toBe('FR');
    });

    it('falls back to the default code when the locale has no region', () => {
      expect(getDefaultCountryCode({ locale: 'fr' })).toBe('FR');
      expect(getDefaultCountryCode({ locale: 'en', defaultCode: 'US' })).toBe('US');
    });

    it('falls back to the default code for an unknown region', () => {
      expect(getDefaultCountryCode({ locale: 'xx-XX' })).toBe('FR');
      expect(getDefaultCountryCode({ locale: 'xx-XX', defaultCode: 'DE' })).toBe('DE');
    });
  });

  describe('parsePhoneNumberDetails', () => {
    it('parses a french mobile number in international format', () => {
      expect(parsePhoneNumberDetails({ phoneNumber: '+33 6 12 34 56 78' })).toEqual([
        { label: 'Country', value: 'FR' },
        { label: 'Country', value: 'France' },
        { label: 'Country calling code', value: '33' },
        { label: 'Is valid?', value: 'Yes' },
        { label: 'Is possible?', value: 'Yes' },
        { label: 'Type', value: 'Mobile' },
        { label: 'International format', value: '+33 6 12 34 56 78' },
        { label: 'National format', value: '06 12 34 56 78' },
        { label: 'E.164 format', value: '+33612345678' },
        { label: 'RFC3966 format', value: 'tel:+33612345678' },
      ]);
    });

    it('parses a national number using the default country code', () => {
      expect(parsePhoneNumberDetails({ phoneNumber: '0612345678', defaultCountryCode: 'FR' })).toEqual([
        { label: 'Country', value: 'FR' },
        { label: 'Country', value: 'France' },
        { label: 'Country calling code', value: '33' },
        { label: 'Is valid?', value: 'Yes' },
        { label: 'Is possible?', value: 'Yes' },
        { label: 'Type', value: 'Mobile' },
        { label: 'International format', value: '+33 6 12 34 56 78' },
        { label: 'National format', value: '06 12 34 56 78' },
        { label: 'E.164 format', value: '+33612345678' },
        { label: 'RFC3966 format', value: 'tel:+33612345678' },
      ]);
    });

    it('parses a us number', () => {
      expect(parsePhoneNumberDetails({ phoneNumber: '202-555-0100', defaultCountryCode: 'US' })).toEqual([
        { label: 'Country', value: 'US' },
        { label: 'Country', value: 'United States' },
        { label: 'Country calling code', value: '1' },
        { label: 'Is valid?', value: 'Yes' },
        { label: 'Is possible?', value: 'Yes' },
        { label: 'Type', value: 'Fixed line or mobile' },
        { label: 'International format', value: '+1 202 555 0100' },
        { label: 'National format', value: '(202) 555-0100' },
        { label: 'E.164 format', value: '+12025550100' },
        { label: 'RFC3966 format', value: 'tel:+12025550100' },
      ]);
    });

    it('throws on unparseable input', () => {
      expect(() => parsePhoneNumberDetails({ phoneNumber: 'foo' })).toThrow();
      expect(() => parsePhoneNumberDetails({ phoneNumber: '' })).toThrow();
      expect(() => parsePhoneNumberDetails({ phoneNumber: '0612345678' })).toThrow();
    });
  });
});
