import { getExtensionFromMimeType, getMimeTypeFromBase64 } from '@/composable/downloadBase64';

export { getFileExtensionFromBase64 };

function getFileExtensionFromBase64({
  base64String,
  defaultExtension = '',
}: {
  base64String: string;
  defaultExtension?: string;
}): string {
  const { mimeType } = getMimeTypeFromBase64({ base64String });

  if (mimeType) {
    return getExtensionFromMimeType(mimeType) || defaultExtension;
  }

  return defaultExtension;
}
