import { describe, expect, it } from 'vitest';
import { describePublicKey, formatAltNames, formatHexColons, parseCertificate, parseDistinguishedName } from './x509-certificate-parser.service';

// A static self-signed test certificate (RSA-1024, SHA-256) with known fields:
// subject/issuer CN=example.com, validity 2024-01-15..2034-01-15, SANs
// example.com / www.example.com / 127.0.0.1, basicConstraints CA:true.
const SELF_SIGNED_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIICvzCCAiigAwIBAgIGChssPU5fMA0GCSqGSIb3DQEBCwUAMHwxFDASBgNVBAMT
C2V4YW1wbGUuY29tMRQwEgYDVQQKEwtFeGFtcGxlIE9yZzEUMBIGA1UECxMLRW5n
aW5lZXJpbmcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYD
VQQHEw1TYW4gRnJhbmNpc2NvMB4XDTI0MDExNTAwMDAwMFoXDTM0MDExNTAwMDAw
MFowfDEUMBIGA1UEAxMLZXhhbXBsZS5jb20xFDASBgNVBAoTC0V4YW1wbGUgT3Jn
MRQwEgYDVQQLEwtFbmdpbmVlcmluZzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNh
bGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28wgZ8wDQYJKoZIhvcNAQEB
BQADgY0AMIGJAoGBANKMVe8hg6DoEi51hOnki8k+kiHulOMTCIPjF5oJA2s4EbJy
sOBCeEaAnB6wzd2tOL865tsoyTd2ERts9qpmqwjZIAV3cc19lFMcwV9Qn0dBn7Ta
j5TJaK2BQv017llu1v5YS1ZZ2p79GsyDw5DUnOzMkehml39WfCXnOmVjCzCXAgMB
AAGjTDBKMAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgKEMC0GA1UdEQQmMCSCC2V4
YW1wbGUuY29tgg93d3cuZXhhbXBsZS5jb22HBH8AAAEwDQYJKoZIhvcNAQELBQAD
gYEAgFjOy8MOmu/TnAew4r8A0OBtZQ0QLXZUFDtb6blqCJLz99F5Nz8d/6knGwoZ
IifdFcdr91A3AycvuRJIiAlXaICqfQTTes9Tfx+F9R2A/Cgzg2FQ5QNBNy44eaSn
hK0CMmbps6Qs8lPGb/53aZpIXnQb8O+OTPlyyfxC1t+pZ7Q=
-----END CERTIFICATE-----`;

// A leaf certificate issued by a separate CA (so NOT self-signed), with no
// subject alternative names and no basicConstraints extension.
const LEAF_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIBpjCCAQ+gAwIBAgIBATANBgkqhkiG9w0BAQsFADAXMRUwEwYDVQQDEwxUZXN0
IFJvb3QgQ0EwHhcNMjQwNjAxMDAwMDAwWhcNMjUwNjAxMDAwMDAwWjAbMRkwFwYD
VQQDExBsZWFmLmV4YW1wbGUuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB
gQCvUcM8HFhFJ+Nxf4vEZhCneIJ5g+4HX1QBMmlyLjLnhupLBmaHqndSN4DMK2ah
Q3ZHJuxpPTQ+pEdS1EsaKPrYSH/RvkMqZocaMG30K1WKN5cnadHiim8RXqztQzwz
BgcFBn4u7biegljvYLBn/o0ryowsLF4J23XkueDSbwW7vQIDAQABMA0GCSqGSIb3
DQEBCwUAA4GBAFrOmwfzql2aVoKBo6xD1lmVnqvk9gDS11gLMWjarM/fv6CYz70e
4x4sj6fSK1vKM6ti79G8yvjADzU3BFrsh6M6pF7Qdy7AJDJz/667FD42A28xuIny
3QCKheifzfFAfiBn0DULCEv/+3c29dgE5k5m+BLQsZvfmvqvf+Roq21v
-----END CERTIFICATE-----`;

describe('x509-certificate-parser', () => {
  describe('parseCertificate (self-signed CA cert)', () => {
    const parsed = parseCertificate(SELF_SIGNED_CERTIFICATE);

    it('extracts the subject distinguished name', () => {
      expect(parsed.subject.commonName).toBe('example.com');
      expect(parsed.subject.organizationName).toBe('Example Org');
      expect(parsed.subject.organizationalUnitName).toBe('Engineering');
      expect(parsed.subject.countryName).toBe('US');
      expect(parsed.subject.stateOrProvinceName).toBe('California');
      expect(parsed.subject.localityName).toBe('San Francisco');
    });

    it('extracts the issuer distinguished name', () => {
      expect(parsed.issuer.commonName).toBe('example.com');
      expect(parsed.issuer.organizationName).toBe('Example Org');
    });

    it('reports the validity period', () => {
      expect(parsed.validity.notBefore.toISOString()).toBe('2024-01-15T00:00:00.000Z');
      expect(parsed.validity.notAfter.toISOString()).toBe('2034-01-15T00:00:00.000Z');
    });

    it('reports version, serial and signature algorithm', () => {
      expect(parsed.version).toBe(3);
      expect(parsed.serialNumber).toBe('0a1b2c3d4e5f');
      expect(parsed.signatureAlgorithm).toBe('sha256WithRSAEncryption');
    });

    it('describes the RSA public key', () => {
      expect(parsed.publicKey.algorithm).toBe('RSA');
      expect(parsed.publicKey.keySizeBits).toBe(1024);
      expect(parsed.publicKey.exponent).toBe(65537);
    });

    it('lists the subject alternative names', () => {
      expect(parsed.subjectAltNames).toEqual(['DNS:example.com', 'DNS:www.example.com', 'IP:127.0.0.1']);
    });

    it('reports basic constraints and self-signed status', () => {
      expect(parsed.basicConstraints.isCertificateAuthority).toBe(true);
      expect(parsed.selfSigned).toBe(true);
    });

    it('computes SHA-1 and SHA-256 fingerprints', () => {
      expect(parsed.fingerprints.sha1).toMatch(/^[0-9a-f]{40}$/);
      expect(parsed.fingerprints.sha256).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('parseCertificate (leaf cert issued by a CA)', () => {
    const parsed = parseCertificate(LEAF_CERTIFICATE);

    it('reports no subject alternative names when the extension is absent', () => {
      expect(parsed.subjectAltNames).toEqual([]);
    });

    it('is not a certificate authority and not self-signed', () => {
      expect(parsed.basicConstraints.isCertificateAuthority).toBe(false);
      expect(parsed.selfSigned).toBe(false);
    });

    it('keeps a subject distinct from its issuer', () => {
      expect(parsed.subject.commonName).toBe('leaf.example.com');
      expect(parsed.issuer.commonName).toBe('Test Root CA');
    });
  });

  describe('parseCertificate errors', () => {
    it('throws on empty input', () => {
      expect(() => parseCertificate('   ')).toThrow();
    });

    it('throws on non-certificate input', () => {
      expect(() => parseCertificate('not a certificate')).toThrow();
    });
  });

  describe('parseDistinguishedName', () => {
    it('maps known short names onto named fields and keeps every attribute', () => {
      const dn = parseDistinguishedName([
        { shortName: 'CN', value: 'host' },
        { shortName: 'O', value: 'Org' },
      ]);

      expect(dn.commonName).toBe('host');
      expect(dn.organizationName).toBe('Org');
      expect(dn.attributes).toHaveLength(2);
    });

    it('keeps unknown / short-name-less attributes without a named field', () => {
      const dn = parseDistinguishedName([
        { name: 'someOtherName', value: 'x' },
        { shortName: 'DC', value: 'com' },
      ]);

      expect(dn.commonName).toBeUndefined();
      expect(dn.attributes).toHaveLength(2);
      expect(dn.attributes[0].value).toBe('x');
    });

    it('coerces a missing value to an empty string', () => {
      const dn = parseDistinguishedName([{ shortName: 'CN' }]);
      expect(dn.commonName).toBe('');
    });
  });

  describe('formatAltNames', () => {
    it('labels each GeneralName type', () => {
      expect(
        formatAltNames([
          { type: 2, value: 'example.com' },
          { type: 7, ip: '10.0.0.1' },
          { type: 1, value: 'a@example.com' },
          { type: 6, value: 'https://example.com' },
        ]),
      ).toEqual(['DNS:example.com', 'IP:10.0.0.1', 'email:a@example.com', 'URI:https://example.com']);
    });

    it('falls back to type-<n> for unknown types and empty value when absent', () => {
      expect(formatAltNames([{ type: 99 }])).toEqual(['type-99:']);
    });
  });

  describe('describePublicKey', () => {
    it('describes an RSA key from modulus and exponent', () => {
      const info = describePublicKey({ n: { bitLength: () => 2048 }, e: { toString: () => '65537' } });
      expect(info).toEqual({ algorithm: 'RSA', keySizeBits: 2048, exponent: 65537 });
    });

    it('reports Unknown for a key without RSA fields', () => {
      expect(describePublicKey({})).toEqual({ algorithm: 'Unknown' });
      expect(describePublicKey(undefined)).toEqual({ algorithm: 'Unknown' });
    });
  });

  describe('formatHexColons', () => {
    it('groups hex into upper-cased colon-separated byte pairs', () => {
      expect(formatHexColons('ab12cd')).toBe('AB:12:CD');
    });

    it('handles a single byte', () => {
      expect(formatHexColons('0a')).toBe('0A');
    });

    it('returns an empty string for empty input', () => {
      expect(formatHexColons('')).toBe('');
    });
  });
});
