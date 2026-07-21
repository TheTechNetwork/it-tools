import { describe, expect, it } from 'vitest';
import { getUrlSearchParamsEntries, parseUrl } from './url-parser.service';

describe('url-parser', () => {
  describe('parseUrl', () => {
    it('parses a full url with credentials, port, query params and hash', () => {
      const url = parseUrl('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');

      expect(url.protocol).toBe('https:');
      expect(url.username).toBe('me');
      expect(url.password).toBe('pwd');
      expect(url.hostname).toBe('it-tools.tech');
      expect(url.port).toBe('3000');
      expect(url.pathname).toBe('/url-parser');
      expect(url.search).toBe('?key1=value&key2=value2');
      expect(url.hash).toBe('#the-hash');
    });

    it('parses a minimal url', () => {
      const url = parseUrl('https://example.com');

      expect(url.protocol).toBe('https:');
      expect(url.username).toBe('');
      expect(url.password).toBe('');
      expect(url.hostname).toBe('example.com');
      expect(url.port).toBe('');
      expect(url.pathname).toBe('/');
      expect(url.search).toBe('');
      expect(url.hash).toBe('');
    });

    it('omits the port when it is the protocol default', () => {
      expect(parseUrl('https://example.com:443/').port).toBe('');
      expect(parseUrl('http://example.com:80/').port).toBe('');
      expect(parseUrl('http://example.com:8080/').port).toBe('8080');
    });

    it('parses non-http protocols', () => {
      expect(parseUrl('ftp://files.example.com/file.txt').protocol).toBe('ftp:');
      expect(parseUrl('mailto:someone@example.com').protocol).toBe('mailto:');
    });

    it('lowercases the hostname', () => {
      expect(parseUrl('https://EXAMPLE.com/Path').hostname).toBe('example.com');
      expect(parseUrl('https://EXAMPLE.com/Path').pathname).toBe('/Path');
    });

    it('exposes query params through searchParams', () => {
      const url = parseUrl('https://example.com/?a=1&b=two%20words');

      expect(url.searchParams.get('a')).toBe('1');
      expect(url.searchParams.get('b')).toBe('two words');
    });

    it('throws on invalid urls', () => {
      expect(() => parseUrl('')).toThrow();
      expect(() => parseUrl('not a url')).toThrow();
      expect(() => parseUrl('example.com')).toThrow();
    });
  });

  describe('getUrlSearchParamsEntries', () => {
    it('returns the query params as key value pairs', () => {
      const url = parseUrl('https://example.com/?key1=value&key2=value2');

      expect(getUrlSearchParamsEntries(url)).toEqual([
        ['key1', 'value'],
        ['key2', 'value2'],
      ]);
    });

    it('returns an empty array when the url is undefined', () => {
      expect(getUrlSearchParamsEntries(undefined)).toEqual([]);
    });

    it('returns an empty array when there is no query string', () => {
      expect(getUrlSearchParamsEntries(parseUrl('https://example.com/'))).toEqual([]);
    });

    it('decodes percent-encoded keys and values', () => {
      const url = parseUrl('https://example.com/?greeting=hello%20world&name=d%C3%A9j%C3%A0');

      expect(getUrlSearchParamsEntries(url)).toEqual([
        ['greeting', 'hello world'],
        ['name', 'déjà'],
      ]);
    });

    it('keeps only the last value of duplicated keys', () => {
      const url = parseUrl('https://example.com/?key=first&key=second');

      expect(getUrlSearchParamsEntries(url)).toEqual([['key', 'second']]);
    });

    it('handles params without values', () => {
      const url = parseUrl('https://example.com/?flag');

      expect(getUrlSearchParamsEntries(url)).toEqual([['flag', '']]);
    });
  });
});
