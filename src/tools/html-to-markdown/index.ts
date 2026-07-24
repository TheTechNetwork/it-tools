import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML to Markdown',
  path: '/html-to-markdown',
  description: 'Convert HTML to clean Markdown, with headings, links, lists, emphasis and fenced code blocks.',
  keywords: ['html', 'markdown', 'md', 'convert', 'converter', 'turndown', 'transform'],
  component: () => import('./html-to-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2026-07-24'),
});
