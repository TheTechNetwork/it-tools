import type { SignatureInfo } from './pdf-signature-checker.types';
import { describe, expect, it } from 'vitest';
import { formatCertificates } from './pdf-signature-checker.service';

type Certificate = SignatureInfo['meta']['certs'][number];

function createCertificate(overrides: Partial<Certificate> = {}): Certificate {
  return {
    issuedBy: { commonName: 'Issuer CA', organizationName: 'Issuer Org' },
    issuedTo: { commonName: 'Signer', organizationName: 'Signer Org' },
    validityPeriod: {
      notBefore: '2020-01-01T00:00:00.000Z',
      notAfter: '2030-01-01T00:00:00.000Z',
    },
    pemCertificate: '-----BEGIN CERTIFICATE-----',
    ...overrides,
  };
}

describe('pdf-signature-checker', () => {
  describe('formatCertificates', () => {
    it('formats each validity date through the injected formatter', () => {
      const result = formatCertificates({
        certs: [createCertificate()],
        formatDate: date => `formatted(${date})`,
        formatCertificateName: ({ number }) => `Certificate #${number}`,
      });

      expect(result[0].validityPeriod).toEqual({
        notBefore: 'formatted(2020-01-01T00:00:00.000Z)',
        notAfter: 'formatted(2030-01-01T00:00:00.000Z)',
      });
    });

    it('assigns a 1-based certificate name per row', () => {
      const result = formatCertificates({
        certs: [createCertificate(), createCertificate()],
        formatDate: date => date,
        formatCertificateName: ({ number }) => `Certificate #${number}`,
      });

      expect(result.map(c => c.certificateName)).toEqual(['Certificate #1', 'Certificate #2']);
    });

    it('preserves the other certificate fields untouched', () => {
      const cert = createCertificate({ pemCertificate: 'PEM-DATA', issuedTo: { commonName: 'Alice', organizationName: 'ACME' } });
      const [result] = formatCertificates({
        certs: [cert],
        formatDate: date => date,
        formatCertificateName: () => 'name',
      });

      expect(result.pemCertificate).toBe('PEM-DATA');
      expect(result.issuedTo).toEqual({ commonName: 'Alice', organizationName: 'ACME' });
      expect(result.issuedBy).toEqual({ commonName: 'Issuer CA', organizationName: 'Issuer Org' });
    });

    it('returns an empty array for no certificates', () => {
      expect(
        formatCertificates({ certs: [], formatDate: d => d, formatCertificateName: () => 'name' }),
      ).toEqual([]);
    });
  });
});
