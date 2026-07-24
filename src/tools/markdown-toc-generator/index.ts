import { ListDetails } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown TOC generator',
  path: '/markdown-toc-generator',
  description: 'Generate a nested table of contents with GitHub-style anchor links from the headings of a Markdown document.',
  keywords: ['markdown', 'toc', 'table', 'contents', 'heading', 'anchor', 'links', 'readme', 'outline'],
  component: () => import('./markdown-toc-generator.vue'),
  icon: ListDetails,
  createdAt: new Date('2026-07-24'),
});
