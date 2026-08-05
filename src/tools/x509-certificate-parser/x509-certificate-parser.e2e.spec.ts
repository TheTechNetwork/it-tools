import { expect, test } from '@playwright/test';

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

test.describe('Tool - X.509 certificate parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/x509-certificate-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('X.509 certificate parser - IT Tools');
  });

  test('Parses a certificate and shows its details', async ({ page }) => {
    await page.getByLabel('PEM certificate').fill(TEST_CERTIFICATE);

    // Subject / issuer common name.
    await expect(page.getByText('example.com').first()).toBeVisible();
    // Signature algorithm from the details section.
    await expect(page.getByText('sha256WithRSAEncryption')).toBeVisible();
    // A subject alternative name.
    await expect(page.getByText('DNS:www.example.com')).toBeVisible();
  });
});
