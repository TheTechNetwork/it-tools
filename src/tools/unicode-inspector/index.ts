import { Typography } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.unicode-inspector.title'),
  path: '/unicode-inspector',
  description: translate('tools.unicode-inspector.description'),
  keywords: ['unicode', 'inspector', 'character', 'code point', 'codepoint', 'utf-8', 'utf-16', 'html', 'entity', 'emoji', 'hex'],
  component: () => import('./unicode-inspector.vue'),
  icon: Typography,
  createdAt: new Date('2026-07-24'),
});
