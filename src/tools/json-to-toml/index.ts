import { IconBraces as Braces } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-to-toml.title'),
  path: '/json-to-toml',
  description: translate('tools.json-to-toml.description'),
  keywords: ['json', 'parse', 'toml', 'convert', 'transform'],
  component: () => import('./json-to-toml.vue'),
  icon: Braces,
  createdAt: new Date('2023-06-23'),
});
