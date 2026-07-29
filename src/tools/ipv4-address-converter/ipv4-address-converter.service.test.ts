import { describe, expect, it } from 'vitest';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';

describe('ipv4-address-converter', () => {
  describe('ipv4ToInt', () => {
    it('should convert an IPv4 address to an integer', () => {
      expect(ipv4ToInt({ ip: '192.168.0.1' })).toBe(3232235521);
      expect(ipv4ToInt({ ip: '10.0.0.1' })).toBe(167772161);
      expect(ipv4ToInt({ ip: '255.255.255.255' })).toBe(4294967295);
      expect(ipv4ToInt({ ip: '0.0.0.0' })).toBe(0);
    });

    it('should trim surrounding whitespace before converting', () => {
      expect(ipv4ToInt({ ip: '  10.0.0.1  ' })).toBe(167772161);
    });

    it('should return 0 for an invalid IPv4 address', () => {
      expect(ipv4ToInt({ ip: '256.168.0.1' })).toBe(0);
      expect(ipv4ToInt({ ip: 'not-an-ip' })).toBe(0);
      expect(ipv4ToInt({ ip: '' })).toBe(0);
    });
  });

  describe('ipv4ToIpv6', () => {
    it('should convert an IPv4 address to its IPv6 mapped form with the default prefix', () => {
      expect(ipv4ToIpv6({ ip: '192.168.0.1' })).toBe('0000:0000:0000:0000:0000:ffff:c0a8:0001');
      expect(ipv4ToIpv6({ ip: '255.255.255.255' })).toBe('0000:0000:0000:0000:0000:ffff:ffff:ffff');
      expect(ipv4ToIpv6({ ip: '0.0.0.0' })).toBe('0000:0000:0000:0000:0000:ffff:0000:0000');
    });

    it('should use a custom prefix when provided', () => {
      expect(ipv4ToIpv6({ ip: '192.168.0.1', prefix: '::ffff:' })).toBe('::ffff:c0a8:0001');
      expect(ipv4ToIpv6({ ip: '10.0.0.1', prefix: '' })).toBe('0a00:0001');
    });

    it('should trim surrounding whitespace before converting', () => {
      expect(ipv4ToIpv6({ ip: '  192.168.0.1  ' })).toBe('0000:0000:0000:0000:0000:ffff:c0a8:0001');
    });

    it('should return an empty string for an invalid IPv4 address', () => {
      expect(ipv4ToIpv6({ ip: '256.168.0.1' })).toBe('');
      expect(ipv4ToIpv6({ ip: 'not-an-ip' })).toBe('');
      expect(ipv4ToIpv6({ ip: '' })).toBe('');
    });
  });

  describe('isValidIpv4', () => {
    it('should return true for a valid IP address', () => {
      expect(isValidIpv4({ ip: '192.168.0.1' })).to.equal(true);
      expect(isValidIpv4({ ip: '10.0.0.1' })).to.equal(true);
    });

    it('should return false for an invalid IP address', () => {
      expect(isValidIpv4({ ip: '256.168.0.1' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.1.2' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.1.' })).to.equal(false);
      expect(isValidIpv4({ ip: '.192.168.0.1' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.a' })).to.equal(false);
    });

    it('should return false for crap as input', () => {
      expect(isValidIpv4({ ip: '' })).to.equal(false);
      expect(isValidIpv4({ ip: ' ' })).to.equal(false);
      expect(isValidIpv4({ ip: 'foo' })).to.equal(false);
      expect(isValidIpv4({ ip: '-1' })).to.equal(false);
      expect(isValidIpv4({ ip: '0' })).to.equal(false);
    });
  });
});
