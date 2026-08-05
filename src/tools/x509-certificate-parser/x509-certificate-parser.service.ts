import { asn1, md, pki } from 'node-forge';

export type { DistinguishedName, ParsedCertificate };
export { formatHexColons, parseCertificate };

interface DistinguishedName {
  commonName?: string;
  organizationName?: string;
  organizationalUnitName?: string;
  countryName?: string;
  stateOrProvinceName?: string;
  localityName?: string;
  // Every attribute, in order, so nothing is lost for less common fields.
  attributes: { shortName?: string; name?: string; value: string }[];
}

interface ParsedCertificate {
  subject: DistinguishedName;
  issuer: DistinguishedName;
  serialNumber: string;
  version: number;
  validity: {
    notBefore: Date;
    notAfter: Date;
  };
  signatureAlgorithm: string;
  publicKey: {
    algorithm: string;
    keySizeBits?: number;
    exponent?: number;
  };
  subjectAltNames: string[];
  basicConstraints: {
    isCertificateAuthority: boolean;
  };
  fingerprints: {
    sha1: string;
    sha256: string;
  };
  selfSigned: boolean;
}

const SHORT_NAME_TO_FIELD: Record<string, keyof Omit<DistinguishedName, 'attributes'>> = {
  CN: 'commonName',
  O: 'organizationName',
  OU: 'organizationalUnitName',
  C: 'countryName',
  ST: 'stateOrProvinceName',
  L: 'localityName',
};

// Groups a lowercase hex digest into colon-separated, upper-cased byte pairs,
// e.g. "ab12cd" -> "AB:12:CD" (the conventional fingerprint/serial display).
function formatHexColons(hex: string): string {
  return (hex.match(/.{1,2}/g) ?? []).join(':').toUpperCase();
}

function parseDistinguishedName(attributes: { shortName?: string; name?: string; value?: unknown }[]): DistinguishedName {
  const dn: DistinguishedName = { attributes: [] };

  for (const attribute of attributes) {
    const value = String(attribute.value ?? '');
    dn.attributes.push({ shortName: attribute.shortName, name: attribute.name, value });

    const field = attribute.shortName ? SHORT_NAME_TO_FIELD[attribute.shortName] : undefined;
    if (field) {
      dn[field] = value;
    }
  }

  return dn;
}

function extractSubjectAltNames(cert: pki.Certificate): string[] {
  const extension = cert.getExtension('subjectAltName') as { altNames?: { type: number; value?: string; ip?: string }[] } | undefined;
  if (!extension?.altNames) {
    return [];
  }

  const typeLabels: Record<number, string> = { 1: 'email', 2: 'DNS', 6: 'URI', 7: 'IP' };

  return extension.altNames.map((altName) => {
    const label = typeLabels[altName.type] ?? `type-${altName.type}`;
    return `${label}:${altName.ip ?? altName.value ?? ''}`;
  });
}

function getFingerprints(cert: pki.Certificate): { sha1: string; sha256: string } {
  const der = asn1.toDer(pki.certificateToAsn1(cert)).getBytes();

  return {
    sha1: md.sha1.create().update(der).digest().toHex(),
    sha256: md.sha256.create().update(der).digest().toHex(),
  };
}

function getPublicKeyInfo(cert: pki.Certificate): ParsedCertificate['publicKey'] {
  const publicKey = cert.publicKey as { n?: { bitLength: () => number }; e?: { toString: () => string } };

  // node-forge fully models RSA keys (modulus `n`, exponent `e`); other key
  // types (e.g. EC) surface without those fields.
  if (publicKey?.n && publicKey?.e) {
    return {
      algorithm: 'RSA',
      keySizeBits: publicKey.n.bitLength(),
      exponent: Number(publicKey.e.toString()),
    };
  }

  return { algorithm: 'Unknown' };
}

function isSelfSigned(cert: pki.Certificate): boolean {
  try {
    return cert.verify(cert);
  }
  catch {
    // verify throws when the issuer key can't validate the signature, which for
    // `cert.verify(cert)` simply means it is not self-signed.
    return false;
  }
}

function parseCertificate(pem: string): ParsedCertificate {
  const trimmed = pem.trim();
  if (trimmed === '') {
    throw new Error('No certificate provided');
  }

  const cert = pki.certificateFromPem(trimmed);

  const basicConstraints = cert.getExtension('basicConstraints') as { cA?: boolean } | undefined;

  return {
    subject: parseDistinguishedName(cert.subject.attributes),
    issuer: parseDistinguishedName(cert.issuer.attributes),
    serialNumber: cert.serialNumber,
    // node-forge stores the raw 0-indexed version; X.509 v3 -> 2, shown as v3.
    version: cert.version + 1,
    validity: {
      notBefore: cert.validity.notBefore,
      notAfter: cert.validity.notAfter,
    },
    signatureAlgorithm: pki.oids[cert.signatureOid] ?? cert.signatureOid,
    publicKey: getPublicKeyInfo(cert),
    subjectAltNames: extractSubjectAltNames(cert),
    basicConstraints: {
      isCertificateAuthority: Boolean(basicConstraints?.cA),
    },
    fingerprints: getFingerprints(cert),
    selfSigned: isSelfSigned(cert),
  };
}
