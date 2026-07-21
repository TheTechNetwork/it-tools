import { normalizeEmail } from 'email-normalizer';
import { withDefaultOnError } from '@/utils/defaults';

export { normalizeEmails };

function normalizeEmails(rawEmails: string): string {
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
