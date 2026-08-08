import { IconAlignJustified as AlignJustified } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.bip39-generator.title'),
  path: '/bip39-generator',
  description: translate('tools.bip39-generator.description'),
  keywords: ['BIP39', 'passphrase', 'generator', 'mnemonic', 'entropy'],
  component: () => import('./bip39-generator.vue'),
  icon: AlignJustified,
});
