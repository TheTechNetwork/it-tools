import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to TypeScript',
  path: '/json-to-typescript',
  description: 'Generate TypeScript interfaces from a JSON object or array, with nested types automatically extracted.',
  keywords: ['json', 'typescript', 'ts', 'interface', 'type', 'types', 'convert', 'generate', 'definition'],
  component: () => import('./json-to-typescript.vue'),
  icon: Braces,
  createdAt: new Date('2026-07-24'),
});
