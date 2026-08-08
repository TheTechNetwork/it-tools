import { IconAlarm as Alarm } from '@tabler/icons-vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.crontab-generator.title'),
  path: '/crontab-generator',
  description: translate('tools.crontab-generator.description'),
  keywords: [
    'crontab',
    'generator',
    'cronjob',
    'cron',
    'schedule',
    'parse',
    'expression',
    'year',
    'month',
    'week',
    'day',
    'minute',
    'second',
  ],
  component: () => import('./crontab-generator.vue'),
  icon: Alarm,
});
