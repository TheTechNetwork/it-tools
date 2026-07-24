import { Contrast } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color contrast checker',
  path: '/color-contrast-checker',
  description: 'Check the WCAG contrast ratio between a text and a background color, and see which accessibility levels (AA / AAA) it passes.',
  keywords: ['color', 'contrast', 'checker', 'wcag', 'accessibility', 'a11y', 'ratio', 'aa', 'aaa', 'foreground', 'background'],
  component: () => import('./color-contrast-checker.vue'),
  icon: Contrast,
  createdAt: new Date('2026-07-24'),
});
