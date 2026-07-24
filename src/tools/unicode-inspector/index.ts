import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Unicode inspector',
  path: '/unicode-inspector',
  description: 'Inspect a string character by character: Unicode code point, decimal value, HTML entity, and UTF-8 / UTF-16 byte sequences.',
  keywords: ['unicode', 'inspector', 'character', 'code point', 'codepoint', 'utf-8', 'utf-16', 'html', 'entity', 'emoji', 'hex'],
  component: () => import('./unicode-inspector.vue'),
  icon: Typography,
  createdAt: new Date('2026-07-24'),
});
