import { ListNumbers } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Text line tools',
  path: '/text-line-tools',
  description: 'Sort, deduplicate, reverse, shuffle, number, trim and filter the lines of a block of text.',
  keywords: ['text', 'line', 'lines', 'sort', 'dedupe', 'deduplicate', 'unique', 'reverse', 'shuffle', 'number', 'trim', 'empty', 'filter'],
  component: () => import('./text-line-tools.vue'),
  icon: ListNumbers,
  createdAt: new Date('2026-07-24'),
});
