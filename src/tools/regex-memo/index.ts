import { BrandJavascript } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.regex-memo.title'),
  path: '/regex-memo',
  description: translate('tools.regex-memo.description'),
  keywords: ['regex', 'regular', 'expression', 'javascript', 'memo', 'cheatsheet'],
  component: () => import('./regex-memo.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-09-20'),
});
