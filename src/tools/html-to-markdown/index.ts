import { Markdown } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.html-to-markdown.title'),
  path: '/html-to-markdown',
  description: translate('tools.html-to-markdown.description'),
  keywords: ['html', 'markdown', 'md', 'convert', 'converter', 'turndown', 'transform'],
  component: () => import('./html-to-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2026-07-24'),
});
