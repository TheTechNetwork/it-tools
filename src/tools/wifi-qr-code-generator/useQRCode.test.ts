import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useWifiQRCode } from './useQRCode';

// Capture what payload string and options the composable feeds into the QR
// generator so we can assert the WIFI: string construction, colour and options
// forwarding without depending on the actual rendered image bytes.
const toDataURL = vi.fn(async (..._args: unknown[]) => 'data:image/png;base64,MOCK');

vi.mock('qrcode', () => ({
  default: { toDataURL: (...args: unknown[]) => toDataURL(...args) },
}));

function baseOptions(overrides: Record<string, unknown> = {}) {
  return {
    ssid: ref('my-ssid'),
    password: ref('my-password'),
    eapMethod: ref('PEAP' as const),
    isHiddenSSID: ref(false),
    eapAnonymous: ref(false),
    eapIdentity: ref('identity'),
    eapPhase2Method: ref('None' as const),
    color: { foreground: ref('#000000ff'), background: ref('#ffffffff') },
    ...overrides,
  };
}

describe('useWifiQRCode', () => {
  beforeEach(() => {
    toDataURL.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults the encryption to WPA', () => {
    const { encryption } = useWifiQRCode(baseOptions());
    expect(encryption.value).toBe('WPA');
  });

  it('builds a WPA payload and outputs the generated data url', async () => {
    const { qrcode } = useWifiQRCode(baseOptions());

    await nextTick();

    expect(toDataURL).toHaveBeenCalled();
    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:my-ssid;T:WPA;P:my-password;;');
    expect(qrcode.value).toBe('data:image/png;base64,MOCK');
  });

  it('forwards foreground/background colours and default error correction to the generator', async () => {
    useWifiQRCode(baseOptions());

    await nextTick();

    const [, opts] = toDataURL.mock.lastCall! as [string, any];
    expect(opts.color).toMatchObject({ dark: '#000000ff', light: '#ffffffff' });
    expect(opts.errorCorrectionLevel).toBe('M');
  });

  it('escapes special characters in the ssid and password', async () => {
    useWifiQRCode(baseOptions({ ssid: ref('a;b,c:d"e\\f'), password: ref('p;w') }));

    await nextTick();

    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:a\\;b\\,c\\:d\\"e\\\\f;T:WPA;P:p\\;w;;');
  });

  it('adds the hidden flag when the ssid is hidden', async () => {
    useWifiQRCode(baseOptions({ isHiddenSSID: ref(true) }));

    await nextTick();

    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:my-ssid;T:WPA;P:my-password;H:true;');
  });

  it('omits the type and password for open (nopass) networks', async () => {
    const opts = baseOptions();
    const { encryption } = useWifiQRCode(opts);
    encryption.value = 'nopass';

    await nextTick();

    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:my-ssid;;');
  });

  it('builds a WPA2-EAP payload with identity and phase 2 method', async () => {
    const opts = baseOptions({ eapPhase2Method: ref('MSCHAPV2' as const) });
    const { encryption } = useWifiQRCode(opts);
    encryption.value = 'WPA2-EAP';

    await nextTick();

    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PEAP;PH2:MSCHAPV2;I:identity;;');
  });

  it('uses the anonymous identity marker when anonymous is set', async () => {
    const opts = baseOptions({ eapAnonymous: ref(true), eapPhase2Method: ref('None' as const) });
    const { encryption } = useWifiQRCode(opts);
    encryption.value = 'WPA2-EAP';

    await nextTick();

    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:my-ssid;T:WPA2-EAP;P:my-password;E:PEAP;A:anon;;');
  });

  it('does not generate anything when the ssid is empty (null payload)', async () => {
    useWifiQRCode(baseOptions({ ssid: ref('') }));

    await nextTick();

    expect(toDataURL).not.toHaveBeenCalled();
  });

  it('regenerates when a reactive field changes', async () => {
    const ssid = ref('first');
    useWifiQRCode(baseOptions({ ssid }));

    await nextTick();
    expect(toDataURL).toHaveBeenCalledTimes(1);

    ssid.value = 'second';
    await nextTick();

    expect(toDataURL).toHaveBeenCalledTimes(2);
    const [text] = toDataURL.mock.lastCall!;
    expect(text).toBe('WIFI:S:second;T:WPA;P:my-password;;');
  });
});
