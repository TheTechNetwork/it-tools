import { types as extensionToMimeType, extensions as mimeTypeToExtension } from 'mime-types';

export {
  getExtensionsFromMimeType,
  getExtensionToMimeTypeOptions,
  getMimeInfos,
  getMimeTypeFromExtension,
  getMimeTypeToExtensionOptions,
};

function getMimeInfos(): { mimeType: string; extensions: string[] }[] {
  return Object.entries(mimeTypeToExtension).map(([mimeType, extensions]) => ({ mimeType, extensions }));
}

function getMimeTypeToExtensionOptions(): { label: string; value: string }[] {
  return Object.keys(mimeTypeToExtension).map(label => ({ label, value: label }));
}

function getExtensionToMimeTypeOptions(): { label: string; value: string }[] {
  return Object.keys(extensionToMimeType).map(label => ({ label: `.${label}`, value: label }));
}

function getExtensionsFromMimeType(mimeType: string): string[] {
  return mimeTypeToExtension[mimeType] ?? [];
}

function getMimeTypeFromExtension(extension: string): string | undefined {
  return extensionToMimeType[extension];
}
