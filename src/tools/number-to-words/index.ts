import { Vocabulary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Number to words',
  path: '/number-to-words',
  description: 'Spell out a number in English words (e.g. 1234 becomes "one thousand two hundred thirty-four"), with support for negatives and decimals.',
  keywords: ['number', 'words', 'spell', 'english', 'text', 'convert', 'cardinal', 'humanize', 'cheque', 'check'],
  component: () => import('./number-to-words.vue'),
  icon: Vocabulary,
  createdAt: new Date('2026-07-24'),
});
