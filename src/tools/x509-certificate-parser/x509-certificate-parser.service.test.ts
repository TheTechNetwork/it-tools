import { describe, expect, it } from 'vitest';
import { formatHexColons, parseCertificate } from './x509-certificate-parser.service';

// A static self-signed test certificate (RSA-1024, SHA-256) with known fields:
// subject/issuer CN=example.com, validity 2024-01-15..2034-01-15, SANs
// example.com / www.example.com / 127.0.0.1, basicConstraints CA:true.
const TEST_CERTIFICATE = `-----BEGIN CERTIFICATE-----
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

describe('x509-certificate-parser', () => {
  describe('parseCertificate', () => {
    const parsed = parseCertificate(TEST_CERTIFICATE);

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

    it('throws on empty input', () => {
      expect(() => parseCertificate('   ')).toThrow();
    });

    it('throws on non-certificate input', () => {
      expect(() => parseCertificate('not a certificate')).toThrow();
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
