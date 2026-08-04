import type { SignatureInfo } from './pdf-signature-checker.types';

export { formatCertificates };

type Certificate = SignatureInfo['meta']['certs'][number];

type FormattedCertificate = Certificate & {
  validityPeriod: {
    notBefore: string;
    notAfter: string;
  };
  certificateName: string;
};

// Maps the raw certificate list into display rows: validity dates are run through
// the injected `formatDate` (locale-sensitive when using toLocaleString in the UI,
// so it is passed in to keep this function pure and testable) and each row gets a
// 1-based name from `formatCertificateName`.
function formatCertificates({
  certs,
  formatDate,
  formatCertificateName,
}: {
  certs: Certificate[];
  formatDate: (date: string) => string;
  formatCertificateName: (params: { number: number }) => string;
}): FormattedCertificate[] {
  return certs.map((certificate, index) => ({
    ...certificate,
    validityPeriod: {
      notBefore: formatDate(certificate.validityPeriod.notBefore),
      notAfter: formatDate(certificate.validityPeriod.notAfter),
    },
    certificateName: formatCertificateName({ number: index + 1 }),
  }));
}
