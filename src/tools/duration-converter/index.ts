import { Hourglass } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Duration converter',
  path: '/duration-converter',
  description: 'Convert a duration between nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days and weeks, with a human-readable breakdown.',
  keywords: ['duration', 'time', 'converter', 'nanosecond', 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'humanize'],
  component: () => import('./duration-converter.vue'),
  icon: Hourglass,
  createdAt: new Date('2026-07-24'),
});
