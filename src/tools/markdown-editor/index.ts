import { IconMarkdown } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.markdown-editor.title'),
  path: '/markdown-editor',
  description: translate('tools.markdown-editor.description'),
  keywords: ['markdown', 'editor', 'preview', 'live', 'md', 'html', 'writer'],
  component: () => import('./markdown-editor.vue'),
  icon: IconMarkdown,
  createdAt: new Date('2026-08-09'),
});
