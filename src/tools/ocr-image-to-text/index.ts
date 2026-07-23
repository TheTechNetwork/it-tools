import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to text (OCR)',
  path: '/ocr-image-to-text',
  description: 'Extract text from images and PDFs (photos, screenshots, scans) with Tesseract OCR, in 30+ languages, in batches. Runs entirely in your browser - files are never uploaded.',
  keywords: ['ocr', 'image', 'pdf', 'text', 'tesseract', 'recognize', 'extract', 'scan', 'photo', 'screenshot', 'picture', 'batch'],
  component: () => import('./ocr-image-to-text.vue'),
  icon: Scan,
  createdAt: new Date('2026-07-23'),
});
