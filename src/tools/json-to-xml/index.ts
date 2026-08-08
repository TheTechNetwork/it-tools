import { IconBraces as Braces } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-to-xml.title'),
  path: '/json-to-xml',
  description: translate('tools.json-to-xml.description'),
  keywords: ['json', 'xml'],
  component: () => import('./json-to-xml.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-09'),
});
