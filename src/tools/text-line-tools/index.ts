import { ListNumbers } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.text-line-tools.title'),
  path: '/text-line-tools',
  description: translate('tools.text-line-tools.description'),
  keywords: ['text', 'line', 'lines', 'sort', 'dedupe', 'deduplicate', 'unique', 'reverse', 'shuffle', 'number', 'trim', 'empty', 'filter'],
  component: () => import('./text-line-tools.vue'),
  icon: ListNumbers,
  createdAt: new Date('2026-07-24'),
});
