import type { QRCodeErrorCorrectionLevel, QRCodeToDataURLOptions } from 'qrcode';
import type { MaybeRef } from 'vue';
import { get } from '@vueuse/core';
import { isRef, ref, watch } from 'vue';
import { createQRCodeDataUrl } from './qr-code-generator.service';

export function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  options,
}: {
  text: MaybeRef<string>;
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> };
  errorCorrectionLevel?: MaybeRef<QRCodeErrorCorrectionLevel>;
  options?: QRCodeToDataURLOptions;
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel].filter(isRef),
    async () => {
      if (get(text)) {
        qrcode.value = await createQRCodeDataUrl({
          text: get(text),
          foreground: get(foreground),
          background: get(background),
          errorCorrectionLevel: get(errorCorrectionLevel),
          options,
        });
      }
    },
    { immediate: true },
  );

  return { qrcode };
}
