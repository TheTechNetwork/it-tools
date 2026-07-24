import { Quote } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'String escape / unescape',
  path: '/string-escape',
  description: 'Escape or unescape a string using backslash sequences (\\n, \\t, \\", \\uXXXX…), as used in JSON, JavaScript and many programming languages.',
  keywords: ['string', 'escape', 'unescape', 'backslash', 'json', 'javascript', 'quote', 'newline', 'tab', 'unicode'],
  component: () => import('./string-escape.vue'),
  icon: Quote,
  createdAt: new Date('2026-07-24'),
});
