import { Braces } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-to-typescript.title'),
  path: '/json-to-typescript',
  description: translate('tools.json-to-typescript.description'),
  keywords: ['json', 'typescript', 'ts', 'interface', 'type', 'types', 'convert', 'generate', 'definition'],
  component: () => import('./json-to-typescript.vue'),
  icon: Braces,
  createdAt: new Date('2026-07-24'),
});
