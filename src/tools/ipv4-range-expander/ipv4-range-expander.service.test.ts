import { describe, expect, it } from 'vitest';
import { calculateCidr } from './ipv4-range-expander.service';

describe('ipv4RangeExpander', () => {
  describe('when there are two valid ipv4 addresses given', () => {
    it('should calculate valid cidr for given addresses', () => {
      const result = calculateCidr({ startIp: '192.168.1.1', endIp: '192.168.7.255' });

      expect(result).toBeDefined();
      expect(result?.oldSize).toEqual(1791);
      expect(result?.newSize).toEqual(2048);
      expect(result?.newStart).toEqual('192.168.0.0');
      expect(result?.newEnd).toEqual('192.168.7.255');
      expect(result?.newCidr).toEqual('192.168.0.0/21');
    });

    it('should calculate valid cidr for given addresses, where first octet is lower than 128', () => {
      const result = calculateCidr({ startIp: '10.0.0.1', endIp: '10.0.0.17' });

      expect(result).toBeDefined();
      expect(result?.oldSize).toEqual(17);
      expect(result?.newSize).toEqual(32);
      expect(result?.newStart).toEqual('10.0.0.0');
      expect(result?.newEnd).toEqual('10.0.0.31');
      expect(result?.newCidr).toEqual('10.0.0.0/27');
    });

    it('should return empty result for invalid input', () => {
      expect(calculateCidr({ startIp: '192.168.7.1', endIp: '192.168.6.255' })).not.toBeDefined();
    });

    it('should handle a range of a single address (start equals end)', () => {
      const result = calculateCidr({ startIp: '10.0.0.5', endIp: '10.0.0.5' });

      expect(result).toBeDefined();
      expect(result?.oldSize).toEqual(1);
      expect(result?.newSize).toEqual(1);
      expect(result?.newStart).toEqual('10.0.0.5');
      expect(result?.newEnd).toEqual('10.0.0.5');
      expect(result?.newCidr).toEqual('10.0.0.5/32');
    });

    it('should expand a range that already aligns to a full block unchanged', () => {
      const result = calculateCidr({ startIp: '192.168.0.0', endIp: '192.168.0.255' });

      expect(result).toBeDefined();
      expect(result?.oldSize).toEqual(256);
      expect(result?.newSize).toEqual(256);
      expect(result?.newStart).toEqual('192.168.0.0');
      expect(result?.newEnd).toEqual('192.168.0.255');
      expect(result?.newCidr).toEqual('192.168.0.0/24');
    });

    it('should return undefined when start ip is greater than end ip', () => {
      expect(calculateCidr({ startIp: '10.0.0.10', endIp: '10.0.0.1' })).toBeUndefined();
    });

    it('should treat invalid ips as 0.0.0.0 yielding a full range', () => {
      const result = calculateCidr({ startIp: 'invalid', endIp: 'also-invalid' });

      expect(result).toBeDefined();
      expect(result?.newCidr).toEqual('0.0.0.0/32');
      expect(result?.oldSize).toEqual(1);
    });
  });
});
