import type { GetQrCodeTextOptions } from './wifi-qr-code-generator.service';
import { describe, expect, it } from 'vitest';
import { EAPMethods, EAPPhase2Methods, escapeString, getQrCodeText, wifiEncryptions } from './wifi-qr-code-generator.service';

function buildOptions(overrides: Partial<GetQrCodeTextOptions> = {}): GetQrCodeTextOptions {
  return {
    ssid: 'my-ssid',
    password: 'my-password',
    encryption: 'WPA',
    eapMethod: 'PWD',
    isHiddenSSID: false,
    eapAnonymous: false,
    eapIdentity: 'identity',
    eapPhase2Method: 'None',
    ...overrides,
  };
}

describe('wifi-qr-code-generator', () => {
  describe('constants', () => {
    it('exposes the supported encryptions and EAP methods', () => {
      expect(wifiEncryptions).toEqual(['WEP', 'WPA', 'nopass', 'WPA2-EAP']);
      expect(EAPMethods).toContain('PEAP');
      expect(EAPMethods).toContain('TLS');
      expect(EAPPhase2Methods).toEqual(['None', 'MSCHAPV2']);
    });
  });

  describe('escapeString', () => {
    it('escapes special characters with a backslash', () => {
      expect(escapeString('a;b')).toBe('a\\;b');
      expect(escapeString('a,b')).toBe('a\\,b');
      expect(escapeString('a:b')).toBe('a\\:b');
      expect(escapeString('a"b')).toBe('a\\"b');
      expect(escapeString('a\\b')).toBe('a\\\\b');
      expect(escapeString(';,:"\\')).toBe('\\;\\,\\:\\"\\\\');
    });

    it('leaves regular characters untouched', () => {
      expect(escapeString('regular text 123')).toBe('regular text 123');
      expect(escapeString('')).toBe('');
    });
  });

  describe('getQrCodeText', () => {
    it('returns null when there is no ssid', () => {
      expect(getQrCodeText(buildOptions({ ssid: '' }))).toBe(null);
    });

    it('builds a minimal payload for open networks', () => {
      expect(getQrCodeText(buildOptions({ encryption: 'nopass' }))).toBe('WIFI:S:my-ssid;;');
    });

    it('builds the payload for WPA networks', () => {
      expect(getQrCodeText(buildOptions({ encryption: 'WPA' }))).toBe('WIFI:S:my-ssid;T:WPA;P:my-password;;');
    });

    it('builds the payload for WEP networks', () => {
      expect(getQrCodeText(buildOptions({ encryption: 'WEP' }))).toBe('WIFI:S:my-ssid;T:WEP;P:my-password;;');
    });

    it('flags hidden ssids', () => {
      expect(getQrCodeText(buildOptions({ encryption: 'WPA', isHiddenSSID: true }))).toBe(
        'WIFI:S:my-ssid;T:WPA;P:my-password;H:true;',
      );
    });

    it('returns null for WPA and WEP networks without password', () => {
      expect(getQrCodeText(buildOptions({ encryption: 'WPA', password: '' }))).toBe(null);
      expect(getQrCodeText(buildOptions({ encryption: 'WEP', password: '' }))).toBe(null);
    });

    it('escapes special characters in the ssid and the password', () => {
      expect(getQrCodeText(buildOptions({ ssid: 'my;ssid', encryption: 'nopass' }))).toBe('WIFI:S:my\\;ssid;;');
      expect(getQrCodeText(buildOptions({ ssid: 'a:b,c', password: 'p"a\\ss;', encryption: 'WPA' }))).toBe(
        'WIFI:S:a\\:b\\,c;T:WPA;P:p\\"a\\\\ss\\;;;',
      );
    });

    describe('for WPA2-EAP networks', () => {
      it('builds the payload with an identity', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP' }))).toBe(
          'WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PWD;I:identity;;',
        );
      });

      it('builds the payload for anonymous identities', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', eapAnonymous: true }))).toBe(
          'WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PWD;A:anon;;',
        );
      });

      it('includes the phase 2 method when it is not None', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', eapMethod: 'PEAP', eapPhase2Method: 'MSCHAPV2' }))).toBe(
          'WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PEAP;PH2:MSCHAPV2;I:identity;;',
        );
      });

      it('flags hidden ssids', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', isHiddenSSID: true }))).toBe(
          'WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PWD;I:identity;H:true;',
        );
      });

      it('escapes the identity', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', eapIdentity: 'user;name' }))).toBe(
          'WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PWD;I:user\\;name;;',
        );
      });

      it('returns null without an identity when not anonymous', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', eapIdentity: '' }))).toBe(null);
      });

      it('returns null without a password or an eap method', () => {
        expect(getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', password: '' }))).toBe(null);
        expect(
          getQrCodeText(buildOptions({ encryption: 'WPA2-EAP', eapMethod: undefined as unknown as 'PWD' })),
        ).toBe(null);
      });

      it('returns null for the PEAP method without a phase 2 method', () => {
        expect(
          getQrCodeText(buildOptions({
            encryption: 'WPA2-EAP',
            eapMethod: 'PEAP',
            eapPhase2Method: undefined as unknown as 'None',
          })),
        ).toBe(null);
      });
    });
  });
});
