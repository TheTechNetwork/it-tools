import { Signature } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.jwt-generator.title'),
  path: '/jwt-generator',
  description: translate('tools.jwt-generator.description'),
  keywords: ['jwt', 'generator', 'sign', 'signer', 'create', 'encode', 'token', 'hs256', 'rs256', 'es256', 'eddsa', 'json', 'web', 'token'],
  component: () => import('./jwt-generator.vue'),
  icon: Signature,
  createdAt: new Date('2026-07-24'),
});
