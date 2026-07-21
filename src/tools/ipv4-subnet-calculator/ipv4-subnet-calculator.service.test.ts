import { describe, expect, it } from 'vitest';
import { getIPClass } from './ipv4-subnet-calculator.models';
import { getNetworkInfo, getNetworkMaskInBinary } from './ipv4-subnet-calculator.service';

describe('ipv4-subnet-calculator', () => {
  describe('getNetworkInfo', () => {
    it('computes the network info for a standard /24 subnet', () => {
      const info = getNetworkInfo('192.168.1.0/24');

      expect(info.base).toBe('192.168.1.0');
      expect(info.mask).toBe('255.255.255.0');
      expect(info.bitmask).toBe(24);
      expect(info.hostmask).toBe('0.0.0.255');
      expect(info.broadcast).toBe('192.168.1.255');
      expect(info.size).toBe(256);
      expect(info.first).toBe('192.168.1.1');
      expect(info.last).toBe('192.168.1.254');
      expect(info.toString()).toBe('192.168.1.0/24');
    });

    it('computes the network info for a large /8 subnet', () => {
      const info = getNetworkInfo('10.0.0.0/8');

      expect(info.base).toBe('10.0.0.0');
      expect(info.mask).toBe('255.0.0.0');
      expect(info.broadcast).toBe('10.255.255.255');
      expect(info.size).toBe(16777216);
      expect(info.first).toBe('10.0.0.1');
      expect(info.last).toBe('10.255.255.254');
    });

    it('normalizes a host address to the base of its block', () => {
      const info = getNetworkInfo('192.168.1.17/24');

      expect(info.base).toBe('192.168.1.0');
      expect(info.toString()).toBe('192.168.1.0/24');
    });

    it('handles /31 point-to-point subnets without a broadcast address', () => {
      const info = getNetworkInfo('192.168.1.5/31');

      expect(info.base).toBe('192.168.1.4');
      expect(info.mask).toBe('255.255.255.254');
      expect(info.hostmask).toBe('0.0.0.1');
      expect(info.broadcast).toBeUndefined();
      expect(info.size).toBe(2);
      expect(info.first).toBe('192.168.1.4');
      expect(info.last).toBe('192.168.1.5');
    });

    it('handles /32 single-host subnets', () => {
      const info = getNetworkInfo('10.0.0.1/32');

      expect(info.base).toBe('10.0.0.1');
      expect(info.mask).toBe('255.255.255.255');
      expect(info.hostmask).toBe('0.0.0.0');
      expect(info.broadcast).toBeUndefined();
      expect(info.size).toBe(1);
      expect(info.first).toBe('10.0.0.1');
      expect(info.last).toBe('10.0.0.1');
    });

    it('defaults to /32 when no mask is provided', () => {
      const info = getNetworkInfo('192.168.0.1');

      expect(info.bitmask).toBe(32);
      expect(info.size).toBe(1);
      expect(info.toString()).toBe('192.168.0.1/32');
    });

    it('trims surrounding whitespace', () => {
      expect(getNetworkInfo('  192.168.1.0/24  ').toString()).toBe('192.168.1.0/24');
    });

    it('provides adjacent blocks through next()', () => {
      const info = getNetworkInfo('192.168.1.0/24');

      expect(info.next().toString()).toBe('192.168.2.0/24');
      expect(info.next(-1).toString()).toBe('192.168.0.0/24');
    });

    it('throws on invalid addresses', () => {
      expect(() => getNetworkInfo('not an ip')).toThrow();
      expect(() => getNetworkInfo('192.168.1.256/24')).toThrow();
      expect(() => getNetworkInfo('192.168.1.0/33')).toThrow();
      expect(() => getNetworkInfo('')).toThrow();
    });
  });

  describe('getNetworkMaskInBinary', () => {
    it('formats the network mask in dotted binary notation', () => {
      expect(getNetworkMaskInBinary({ bitmask: 24 })).toBe('11111111.11111111.11111111.00000000');
      expect(getNetworkMaskInBinary({ bitmask: 8 })).toBe('11111111.00000000.00000000.00000000');
      expect(getNetworkMaskInBinary({ bitmask: 20 })).toBe('11111111.11111111.11110000.00000000');
    });

    it('handles the /0 and /32 edge cases', () => {
      expect(getNetworkMaskInBinary({ bitmask: 0 })).toBe('00000000.00000000.00000000.00000000');
      expect(getNetworkMaskInBinary({ bitmask: 32 })).toBe('11111111.11111111.11111111.11111111');
    });
  });

  describe('getIPClass', () => {
    it('detects class A addresses', () => {
      expect(getIPClass({ ip: '0.0.0.0' })).toBe('A');
      expect(getIPClass({ ip: '10.0.0.1' })).toBe('A');
      expect(getIPClass({ ip: '127.255.255.255' })).toBe('A');
    });

    it('detects class B addresses', () => {
      expect(getIPClass({ ip: '128.0.0.0' })).toBe('B');
      expect(getIPClass({ ip: '172.16.0.1' })).toBe('B');
      expect(getIPClass({ ip: '191.255.255.255' })).toBe('B');
    });

    it('detects class C addresses', () => {
      expect(getIPClass({ ip: '192.168.1.1' })).toBe('C');
      expect(getIPClass({ ip: '223.255.255.255' })).toBe('C');
    });

    it('detects class D addresses', () => {
      expect(getIPClass({ ip: '224.0.0.1' })).toBe('D');
      expect(getIPClass({ ip: '239.255.255.255' })).toBe('D');
    });

    it('detects class E addresses', () => {
      expect(getIPClass({ ip: '240.0.0.0' })).toBe('E');
      expect(getIPClass({ ip: '255.255.255.255' })).toBe('E');
    });

    it('returns undefined for out-of-range or invalid values', () => {
      expect(getIPClass({ ip: '256.0.0.0' })).toBeUndefined();
      expect(getIPClass({ ip: 'not-an-ip' })).toBeUndefined();
    });
  });
});
