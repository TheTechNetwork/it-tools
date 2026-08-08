import { IconCertificate as Certificate } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.x509-certificate-parser.title'),
  path: '/x509-certificate-parser',
  description: translate('tools.x509-certificate-parser.description'),
  keywords: ['x509', 'certificate', 'parser', 'decoder', 'pem', 'ssl', 'tls', 'crypto', 'ca', 'fingerprint', 'san'],
  component: () => import('./x509-certificate-parser.vue'),
  icon: Certificate,
  createdAt: new Date('2026-08-05'),
});
