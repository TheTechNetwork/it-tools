import { Braces } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.xml-to-json.title'),
  path: '/xml-to-json',
  description: translate('tools.xml-to-json.description'),
  keywords: ['xml', 'json'],
  component: () => import('./xml-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-09'),
});
