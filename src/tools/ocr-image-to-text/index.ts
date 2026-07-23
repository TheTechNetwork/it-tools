import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to text (OCR)',
  path: '/ocr-image-to-text',
  description: 'Extract text from an image (photo, screenshot or scan) with Tesseract OCR, in 30+ languages. Runs entirely in your browser - the image is never uploaded.',
  keywords: ['ocr', 'image', 'text', 'tesseract', 'recognize', 'extract', 'scan', 'photo', 'screenshot', 'picture'],
  component: () => import('./ocr-image-to-text.vue'),
  icon: Scan,
  createdAt: new Date('2026-07-23'),
});
