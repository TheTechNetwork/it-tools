import { describe, expect, it } from 'vitest';
import { getUserAgentInfo } from './user-agent-parser.service';

describe('user-agent-parser', () => {
  describe('getUserAgentInfo', () => {
    it('parses a Chrome on Windows user agent', () => {
      const ua
        = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
      const info = getUserAgentInfo(ua);

      expect(info.ua).toBe(ua);
      expect(info.browser.name).toBe('Chrome');
      expect(info.browser.version).toBe('125.0.0.0');
      expect(info.engine.name).toBe('Blink');
      expect(info.engine.version).toBe('125.0.0.0');
      expect(info.os.name).toBe('Windows');
      expect(info.os.version).toBe('10');
      expect(info.cpu.architecture).toBe('amd64');
    });

    it('parses a Safari on iOS user agent', () => {
      const ua
        = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1';
      const info = getUserAgentInfo(ua);

      expect(info.browser.name).toBe('Mobile Safari');
      expect(info.browser.version).toBe('17.4.1');
      expect(info.engine.name).toBe('WebKit');
      expect(info.engine.version).toBe('605.1.15');
      expect(info.os.name).toBe('iOS');
      expect(info.os.version).toBe('17.4.1');
      expect(info.device.type).toBe('mobile');
      expect(info.device.model).toBe('iPhone');
      expect(info.device.vendor).toBe('Apple');
    });

    it('parses a Firefox on Linux user agent', () => {
      const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0';
      const info = getUserAgentInfo(ua);

      expect(info.browser.name).toBe('Firefox');
      expect(info.browser.version).toBe('126.0');
      expect(info.engine.name).toBe('Gecko');
      expect(info.os.name).toBe('Linux');
      expect(info.cpu.architecture).toBe('amd64');
    });

    it('trims surrounding whitespace before parsing', () => {
      const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0';
      const info = getUserAgentInfo(`  ${ua}  `);

      expect(info.ua).toBe(ua);
      expect(info.browser.name).toBe('Firefox');
    });

    it('returns an empty result for empty or whitespace-only input', () => {
      for (const emptyUa of ['', '   ', '\n\t']) {
        const info = getUserAgentInfo(emptyUa);

        expect(info.ua).toBe('');
        expect(info.browser.name).toBeUndefined();
        expect(info.engine.name).toBeUndefined();
        expect(info.os.name).toBeUndefined();
        expect(info.device.model).toBeUndefined();
        expect(info.cpu.architecture).toBeUndefined();
      }
    });

    it('returns an unparsed result for a nonsensical user agent string', () => {
      const info = getUserAgentInfo('definitely not a user agent');

      expect(info.ua).toBe('definitely not a user agent');
      expect(info.browser.name).toBeUndefined();
      expect(info.os.name).toBeUndefined();
    });
  });
});
