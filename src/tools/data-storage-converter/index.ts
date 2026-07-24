import { Database } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.data-storage-converter.title'),
  path: '/data-storage-converter',
  description: translate('tools.data-storage-converter.description'),
  keywords: ['data', 'storage', 'size', 'converter', 'byte', 'bit', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'kibibyte', 'mebibyte', 'gibibyte', 'binary', 'decimal', 'iec', 'si'],
  component: () => import('./data-storage-converter.vue'),
  icon: Database,
  createdAt: new Date('2026-07-24'),
});
