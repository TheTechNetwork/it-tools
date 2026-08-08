import { IconFileText as FileText } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.text-statistics.title'),
  path: '/text-statistics',
  description: translate('tools.text-statistics.description'),
  keywords: ['text', 'statistics', 'length', 'characters', 'count', 'size', 'bytes'],
  component: () => import('./text-statistics.vue'),
  icon: FileText,
  redirectFrom: ['/text-stats'],
});
