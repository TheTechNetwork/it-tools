import { IconLetterCaseToggle as LetterCaseToggle } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.case-converter.title'),
  path: '/case-converter',
  description: translate('tools.case-converter.description'),
  keywords: [
    'case',
    'converter',
    'camelCase',
    'capitalCase',
    'constantCase',
    'dotCase',
    'headerCase',
    'kebabCase',
    'noCase',
    'paramCase',
    'pascalCase',
    'pathCase',
    'sentenceCase',
    'snakeCase',
    'trainCase',
  ],
  component: () => import('./case-converter.vue'),
  icon: LetterCaseToggle,
});
