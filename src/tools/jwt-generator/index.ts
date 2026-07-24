import { Signature } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT generator',
  path: '/jwt-generator',
  description: 'Sign and generate a JSON Web Token (JWT) from a payload and key - HS256/384/512, RS, PS, ES and EdDSA. Runs entirely in your browser; the key never leaves your device.',
  keywords: ['jwt', 'generator', 'sign', 'signer', 'create', 'encode', 'token', 'hs256', 'rs256', 'es256', 'eddsa', 'json', 'web', 'token'],
  component: () => import('./jwt-generator.vue'),
  icon: Signature,
  createdAt: new Date('2026-07-24'),
});
