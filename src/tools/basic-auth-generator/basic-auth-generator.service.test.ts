import { describe, expect, it } from 'vitest';
import { getBasicAuthHeader } from './basic-auth-generator.service';

describe('basic-auth-generator', () => {
  describe('getBasicAuthHeader', () => {
    it('builds the authorization header for a username and password', () => {
      expect(getBasicAuthHeader({ username: 'user', password: 'password' })).toBe(
        'Authorization: Basic dXNlcjpwYXNzd29yZA==',
      );
    });

    it('builds the well-known header for the RFC 7617 example', () => {
      expect(getBasicAuthHeader({ username: 'Aladdin', password: 'open sesame' })).toBe(
        'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
      );
    });

    it('builds the header with empty username and password', () => {
      expect(getBasicAuthHeader({ username: '', password: '' })).toBe('Authorization: Basic Og==');
    });

    it('builds the header with an empty password', () => {
      expect(getBasicAuthHeader({ username: 'user', password: '' })).toBe('Authorization: Basic dXNlcjo=');
    });

    it('handles passwords that contain a colon', () => {
      expect(getBasicAuthHeader({ username: 'user', password: 'pa:ss' })).toBe(
        'Authorization: Basic dXNlcjpwYTpzcw==',
      );
    });

    it('handles unicode credentials', () => {
      expect(getBasicAuthHeader({ username: 'usér', password: 'pâssword' })).toBe(
        'Authorization: Basic dXPDqXI6cMOic3N3b3Jk',
      );
    });
  });
});
