import { IconFileCheck as FileCheck } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.file-hash.title'),
  path: '/file-hash',
  description: translate('tools.file-hash.description'),
  keywords: ['file', 'hash', 'checksum', 'md5', 'sha1', 'sha256', 'sha512', 'checker', 'verify', 'integrity'],
  component: () => import('./file-hash.vue'),
  icon: FileCheck,
  createdAt: new Date('2026-08-08'),
});
