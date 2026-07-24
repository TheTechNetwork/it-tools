import { ListDetails } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.markdown-toc-generator.title'),
  path: '/markdown-toc-generator',
  description: translate('tools.markdown-toc-generator.description'),
  keywords: ['markdown', 'toc', 'table', 'contents', 'heading', 'anchor', 'links', 'readme', 'outline'],
  component: () => import('./markdown-toc-generator.vue'),
  icon: ListDetails,
  createdAt: new Date('2026-07-24'),
});
