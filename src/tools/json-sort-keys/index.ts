import { SortAscendingLetters } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-sort-keys.title'),
  path: '/json-sort-keys',
  description: translate('tools.json-sort-keys.description'),
  keywords: ['json', 'sort', 'keys', 'order', 'canonical', 'normalize', 'diff', 'alphabetical'],
  component: () => import('./json-sort-keys.vue'),
  icon: SortAscendingLetters,
  createdAt: new Date('2026-07-24'),
});
