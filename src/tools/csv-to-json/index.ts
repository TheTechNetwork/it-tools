import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSV to JSON',
  path: '/csv-to-json',
  description: 'Convert CSV (comma, semicolon or any delimiter) to JSON, with proper handling of quoted fields, escaped quotes and embedded newlines.',
  keywords: ['csv', 'json', 'convert', 'converter', 'parse', 'delimiter', 'tsv', 'spreadsheet', 'table'],
  component: () => import('./csv-to-json.vue'),
  icon: FileText,
  createdAt: new Date('2026-07-24'),
});
