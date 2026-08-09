import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue';

interface CronDescriptionConfig {
  verbose?: boolean;
  dayOfWeekStartIndexZero?: boolean;
  use24HourTimeFormat?: boolean;
  throwExceptionOnParseError?: boolean;
}

export function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

export function getCronDescription(cron: string, config?: CronDescriptionConfig): string {
  if (isCronValid(cron)) {
    return cronstrue.toString(cron, config);
  }
  return ' ';
}
