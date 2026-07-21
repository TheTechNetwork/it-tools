import { ValidationErrorsIBAN } from 'ibantools';
import { describe, expect, it } from 'vitest';
import { getFriendlyErrors } from './iban-validator-and-parser.service';

describe('iban-validator-and-parser', () => {
  describe('getFriendlyErrors', () => {
    it('maps error codes to friendly messages', () => {
      expect(getFriendlyErrors([ValidationErrorsIBAN.NoIBANProvided])).toEqual(['No IBAN provided']);
      expect(getFriendlyErrors([ValidationErrorsIBAN.WrongIBANChecksum])).toEqual(['Wrong IBAN checksum']);
      expect(getFriendlyErrors([ValidationErrorsIBAN.QRIBANNotAllowed])).toEqual(['QR-IBAN not allowed']);
    });

    it('maps multiple error codes and preserves their order', () => {
      expect(
        getFriendlyErrors([
          ValidationErrorsIBAN.NoIBANCountry,
          ValidationErrorsIBAN.WrongBBANLength,
          ValidationErrorsIBAN.WrongBBANFormat,
          ValidationErrorsIBAN.ChecksumNotNumber,
          ValidationErrorsIBAN.WrongAccountBankBranchChecksum,
        ]),
      ).toEqual([
        'No IBAN country',
        'Wrong BBAN length',
        'Wrong BBAN format',
        'Checksum is not a number',
        'Wrong account bank branch checksum',
      ]);
    });

    it('filters out unknown error codes', () => {
      expect(getFriendlyErrors([999 as ValidationErrorsIBAN])).toEqual([]);
    });

    it('returns an empty array for no errors', () => {
      expect(getFriendlyErrors([])).toEqual([]);
    });
  });
});
