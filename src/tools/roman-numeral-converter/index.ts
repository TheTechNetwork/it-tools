import { IconLetterX as LetterX } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.roman-numeral-converter.title'),
  path: '/roman-numeral-converter',
  description: translate('tools.roman-numeral-converter.description'),
  keywords: ['roman', 'arabic', 'converter', 'X', 'I', 'V', 'L', 'C', 'D', 'M'],
  component: () => import('./roman-numeral-converter.vue'),
  icon: LetterX,
});
