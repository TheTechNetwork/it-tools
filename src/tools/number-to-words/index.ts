import { Vocabulary } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.number-to-words.title'),
  path: '/number-to-words',
  description: translate('tools.number-to-words.description'),
  keywords: ['number', 'words', 'spell', 'english', 'text', 'convert', 'cardinal', 'humanize', 'cheque', 'check'],
  component: () => import('./number-to-words.vue'),
  icon: Vocabulary,
  createdAt: new Date('2026-07-24'),
});
