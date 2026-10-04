import { IconStack2 } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.recipe-builder.title'),
  path: '/recipe-builder',
  description: translate('tools.recipe-builder.description'),
  keywords: ['recipe', 'chain', 'pipeline', 'compose', 'workflow', 'steps', 'bake'],
  component: () => import('./recipe-builder.vue'),
  icon: IconStack2,
  createdAt: new Date('2026-10-04'),
});
