import { withDefaultOnError } from '@/utils/defaults';
import { normalizeEmail } from './normalize-email';

export function normalizeEmails(rawEmails: string): string {
  if (!rawEmails) {
    return '';
  }

  return rawEmails
    .split('\n')
    .map((email) => {
      return withDefaultOnError(() => normalizeEmail({ email }), `Unable to parse email: ${email}`);
    })
    .join('\n');
}
