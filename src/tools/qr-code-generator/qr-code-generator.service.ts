import type { QRCodeErrorCorrectionLevel, QRCodeToDataURLOptions } from 'qrcode';
import QRCode from 'qrcode';

export { createQRCodeDataUrl };

function createQRCodeDataUrl({
  text,
  foreground,
  background,
  errorCorrectionLevel,
  options,
}: {
  text: string;
  foreground: string;
  background: string;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  options?: QRCodeToDataURLOptions;
}): Promise<string> {
  return QRCode.toDataURL(text.trim(), {
    color: {
      dark: foreground,
      light: background,
      ...options?.color,
    },
    errorCorrectionLevel: errorCorrectionLevel ?? 'M',
    ...options,
  });
}
