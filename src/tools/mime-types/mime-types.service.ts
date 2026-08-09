import { types as extensionToMimeType, extensions as mimeTypeToExtension } from 'mime-types';

export function getMimeInfos(): { mimeType: string; extensions: string[] }[] {
  return Object.entries(mimeTypeToExtension).map(([mimeType, extensions]) => ({ mimeType, extensions }));
}

export function getMimeTypeToExtensionOptions(): { label: string; value: string }[] {
  return Object.keys(mimeTypeToExtension).map(label => ({ label, value: label }));
}

export function getExtensionToMimeTypeOptions(): { label: string; value: string }[] {
  return Object.keys(extensionToMimeType).map(label => ({ label: `.${label}`, value: label }));
}

export function getExtensionsFromMimeType(mimeType: string): string[] {
  return mimeTypeToExtension[mimeType] ?? [];
}

export function getMimeTypeFromExtension(extension: string): string | undefined {
  return extensionToMimeType[extension];
}
