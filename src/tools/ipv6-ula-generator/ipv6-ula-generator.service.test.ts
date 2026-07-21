import { describe, expect, it } from 'vitest';
import { generateUla } from './ipv6-ula-generator.service';

describe('ipv6-ula-generator', () => {
  describe('generateUla', () => {
    it('generates a deterministic ULA for a given MAC address and timestamp', () => {
      const result = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 1700000000000 });

      expect(result).toEqual({
        ula: 'fdb7:29eb:4229::/48',
        firstRoutableBlock: 'fdb7:29eb:4229:0::/64',
        lastRoutableBlock: 'fdb7:29eb:4229:ffff::/64',
      });
    });

    it('generates addresses in the fd00::/8 ULA range', () => {
      const { ula, firstRoutableBlock, lastRoutableBlock } = generateUla({ macAddress: 'de:ad:be:ef:00:42' });

      expect(ula).toMatch(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}::\/48$/);
      expect(firstRoutableBlock).toMatch(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}:0::\/64$/);
      expect(lastRoutableBlock).toMatch(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}:ffff::\/64$/);
    });

    it('derives the routable blocks from the same /48 prefix as the ULA', () => {
      const { ula, firstRoutableBlock, lastRoutableBlock } = generateUla({
        macAddress: '00:11:22:33:44:55',
        timestamp: 1234567890123,
      });

      const prefix = ula.replace('::/48', '');

      expect(firstRoutableBlock).toBe(`${prefix}:0::/64`);
      expect(lastRoutableBlock).toBe(`${prefix}:ffff::/64`);
    });

    it('is deterministic for identical inputs', () => {
      const a = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 42 });
      const b = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 42 });

      expect(a).toEqual(b);
    });

    it('produces different prefixes for different timestamps', () => {
      const a = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 1 });
      const b = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 2 });

      expect(a.ula).not.toBe(b.ula);
    });

    it('produces different prefixes for different MAC addresses', () => {
      const a = generateUla({ macAddress: '20:37:06:12:34:56', timestamp: 42 });
      const b = generateUla({ macAddress: '20:37:06:12:34:57', timestamp: 42 });

      expect(a.ula).not.toBe(b.ula);
    });

    it('defaults the timestamp to the current time', () => {
      const { ula } = generateUla({ macAddress: '20:37:06:12:34:56' });

      expect(ula).toMatch(/^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}::\/48$/);
    });
  });
});
