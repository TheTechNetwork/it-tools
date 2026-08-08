import { IconSpeakerphone as Speakerphone } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.text-to-nato-alphabet.title'),
  path: '/text-to-nato-alphabet',
  description: translate('tools.text-to-nato-alphabet.description'),
  keywords: ['string', 'nato', 'alphabet', 'phonetic', 'oral', 'transmission'],
  component: () => import('./text-to-nato-alphabet.vue'),
  icon: Speakerphone,
});
