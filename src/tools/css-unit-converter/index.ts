import { IconRulerMeasure } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.css-unit-converter.title'),
  path: '/css-unit-converter',
  description: translate('tools.css-unit-converter.description'),
  keywords: ['css', 'unit', 'converter', 'px', 'rem', 'em', 'pt', 'percent', 'inch', 'cm', 'mm'],
  component: () => import('./css-unit-converter.vue'),
  icon: IconRulerMeasure,
  createdAt: new Date('2026-08-09'),
});
