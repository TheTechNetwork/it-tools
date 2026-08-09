import { IconJson } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.jsonpath-query.title'),
  path: '/jsonpath-query',
  description: translate('tools.jsonpath-query.description'),
  keywords: ['jsonpath', 'json', 'query', 'path', 'filter', 'extract', 'jq'],
  component: () => import('./jsonpath-query.vue'),
  icon: IconJson,
  createdAt: new Date('2026-08-09'),
});
