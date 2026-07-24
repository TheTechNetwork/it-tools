import { FileText } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.csv-to-json.title'),
  path: '/csv-to-json',
  description: translate('tools.csv-to-json.description'),
  keywords: ['csv', 'json', 'convert', 'converter', 'parse', 'delimiter', 'tsv', 'spreadsheet', 'table'],
  component: () => import('./csv-to-json.vue'),
  icon: FileText,
  createdAt: new Date('2026-07-24'),
});
