import { Hourglass } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.duration-converter.title'),
  path: '/duration-converter',
  description: translate('tools.duration-converter.description'),
  keywords: ['duration', 'time', 'converter', 'nanosecond', 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'humanize'],
  component: () => import('./duration-converter.vue'),
  icon: Hourglass,
  createdAt: new Date('2026-07-24'),
});
