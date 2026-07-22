import type { OuiData } from './mac-address-lookup.service';
import db from 'oui-data';
import { describe, expect, it, vi } from 'vitest';
import { getVendorValue, loadOuiData, lookupMacAddressVendor } from './mac-address-lookup.service';

const ouiData = db as OuiData;

describe('mac-address-lookup', () => {
  describe('getVendorValue', () => {
    it('extracts the OUI prefix from a colon-separated MAC address', () => {
      expect(getVendorValue('20:37:06:12:34:56')).toBe('203706');
    });

    it('extracts the OUI prefix from dash and dot separated MAC addresses', () => {
      expect(getVendorValue('20-37-06-12-34-56')).toBe('203706');
      expect(getVendorValue('2037.0612.3456')).toBe('203706');
    });

    it('uppercases lowercase input', () => {
      expect(getVendorValue('ab:cd:ef:12:34:56')).toBe('ABCDEF');
    });

    it('trims surrounding whitespace', () => {
      expect(getVendorValue('  20:37:06:12:34:56  ')).toBe('203706');
    });

    it('handles partial MAC addresses', () => {
      expect(getVendorValue('20:37')).toBe('2037');
      expect(getVendorValue('')).toBe('');
    });
  });

  describe('lookupMacAddressVendor', () => {
    it('finds the vendor of a known OUI', () => {
      expect(lookupMacAddressVendor(ouiData, '20:37:06:12:34:56')).toContain('Cisco Systems');
      expect(lookupMacAddressVendor(ouiData, '00:00:0C:11:22:33')).toContain('Cisco Systems');
      expect(lookupMacAddressVendor(ouiData, '00:00:00:00:00:00')).toContain('XEROX CORPORATION');
    });

    it('is case and separator insensitive', () => {
      expect(lookupMacAddressVendor(ouiData, '20-37-06-ab-cd-ef')).toContain('Cisco Systems');
      expect(lookupMacAddressVendor(ouiData, '0000.0c11.2233')).toContain('Cisco Systems');
    });

    it('returns undefined for an unknown OUI', () => {
      expect(lookupMacAddressVendor(ouiData, 'FF:FF:FF:FF:FF:FF')).toBeUndefined();
    });

    it('returns undefined for empty or invalid input', () => {
      expect(lookupMacAddressVendor(ouiData, '')).toBeUndefined();
      expect(lookupMacAddressVendor(ouiData, 'not a mac address')).toBeUndefined();
    });
  });

  describe('loadOuiData', () => {
    it('fetches and parses the database once, memoising the result', async () => {
      const fakeDb: OuiData = { 203706: 'Cisco Systems, Inc' };
      const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve(fakeDb) });
      vi.stubGlobal('fetch', fetchMock);

      const first = await loadOuiData();
      const second = await loadOuiData();

      expect(first).toBe(fakeDb);
      expect(second).toBe(first);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      vi.unstubAllGlobals();
    });
  });
});
