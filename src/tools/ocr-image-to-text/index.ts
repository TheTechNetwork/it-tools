import { Scan } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.ocr-image-to-text.title'),
  path: '/ocr-image-to-text',
  description: translate('tools.ocr-image-to-text.description'),
  keywords: ['ocr', 'image', 'pdf', 'text', 'tesseract', 'recognize', 'extract', 'scan', 'photo', 'screenshot', 'picture', 'batch'],
  component: () => import('./ocr-image-to-text.vue'),
  icon: Scan,
  createdAt: new Date('2026-07-23'),
});
