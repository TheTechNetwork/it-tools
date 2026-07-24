import { Quote } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.string-escape.title'),
  path: '/string-escape',
  description: translate('tools.string-escape.description'),
  keywords: ['string', 'escape', 'unescape', 'backslash', 'json', 'javascript', 'quote', 'newline', 'tab', 'unicode'],
  component: () => import('./string-escape.vue'),
  icon: Quote,
  createdAt: new Date('2026-07-24'),
});
