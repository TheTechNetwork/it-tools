import { Contrast } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.color-contrast-checker.title'),
  path: '/color-contrast-checker',
  description: translate('tools.color-contrast-checker.description'),
  keywords: ['color', 'contrast', 'checker', 'wcag', 'accessibility', 'a11y', 'ratio', 'aa', 'aaa', 'foreground', 'background'],
  component: () => import('./color-contrast-checker.vue'),
  icon: Contrast,
  createdAt: new Date('2026-07-24'),
});
