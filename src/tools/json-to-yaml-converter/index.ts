import { IconBraces as Braces } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-to-yaml-converter.title'),
  path: '/json-to-yaml-converter',
  description: translate('tools.json-to-yaml-converter.description'),
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./json-to-yaml-converter.vue'),
  icon: Braces,
  createdAt: new Date('2023-04-10'),
});
