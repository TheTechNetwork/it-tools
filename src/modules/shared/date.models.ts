import { format } from 'date-fns';

export function getUrlFriendlyDateTime({ date = new Date() }: { date?: Date } = {}) {
  return format(date, 'yyyy-MM-dd-HH-mm-ss');
}
