import { SortAscendingLetters } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON sort keys',
  path: '/json-sort-keys',
  description: 'Recursively sort the keys of a JSON object to produce a canonical, diff-friendly output (array order is preserved).',
  keywords: ['json', 'sort', 'keys', 'order', 'canonical', 'normalize', 'diff', 'alphabetical'],
  component: () => import('./json-sort-keys.vue'),
  icon: SortAscendingLetters,
  createdAt: new Date('2026-07-24'),
});
