import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Data storage converter',
  path: '/data-storage-converter',
  description: 'Convert digital storage sizes between bits, bytes and their decimal (kB, MB, GB…) and binary (KiB, MiB, GiB…) multiples.',
  keywords: ['data', 'storage', 'size', 'converter', 'byte', 'bit', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'kibibyte', 'mebibyte', 'gibibyte', 'binary', 'decimal', 'iec', 'si'],
  component: () => import('./data-storage-converter.vue'),
  icon: Database,
  createdAt: new Date('2026-07-24'),
});
