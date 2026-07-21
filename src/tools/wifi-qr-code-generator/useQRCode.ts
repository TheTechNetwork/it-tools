import type { QRCodeToDataURLOptions } from 'qrcode';
import type { MaybeRef } from 'vue';
import type { EAPMethod, EAPPhase2Method, WifiEncryption } from './wifi-qr-code-generator.service';
import { get } from '@vueuse/core';
import QRCode from 'qrcode';
import { isRef, ref, watch } from 'vue';
import { getQrCodeText } from './wifi-qr-code-generator.service';

export { EAPMethods, EAPPhase2Methods, wifiEncryptions } from './wifi-qr-code-generator.service';
export type { EAPMethod, EAPPhase2Method, WifiEncryption } from './wifi-qr-code-generator.service';

interface IWifiQRCodeOptions {
  ssid: MaybeRef<string>;
  password: MaybeRef<string>;
  eapMethod: MaybeRef<EAPMethod>;
  isHiddenSSID: MaybeRef<boolean>;
  eapAnonymous: MaybeRef<boolean>;
  eapIdentity: MaybeRef<string>;
  eapPhase2Method: MaybeRef<EAPPhase2Method>;
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> };
  options?: QRCodeToDataURLOptions;
}

export function useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: { background, foreground },
  options,
}: IWifiQRCodeOptions) {
  const qrcode = ref('');
  const encryption = ref<WifiEncryption>('WPA');

  watch(
    [ssid, password, encryption, eapMethod, isHiddenSSID, eapAnonymous, eapIdentity, eapPhase2Method, background, foreground].filter(isRef),
    async () => {
      // @see https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11
      // This is the full spec, there's quite a bit of logic to generate the string embeddedin the QR code.
      const text = getQrCodeText({
        ssid: get(ssid),
        password: get(password),
        encryption: get(encryption),
        eapMethod: get(eapMethod),
        isHiddenSSID: get(isHiddenSSID),
        eapAnonymous: get(eapAnonymous),
        eapIdentity: get(eapIdentity),
        eapPhase2Method: get(eapPhase2Method),
      });
      if (text) {
        qrcode.value = await QRCode.toDataURL(get(text).trim(), {
          color: {
            dark: get(foreground),
            light: get(background),
            ...options?.color,
          },
          errorCorrectionLevel: 'M',
          ...options,
        });
      }
    },
    { immediate: true },
  );
  return { qrcode, encryption };
}
