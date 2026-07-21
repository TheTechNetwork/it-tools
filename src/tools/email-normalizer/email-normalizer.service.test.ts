import { describe, expect, it } from 'vitest';
import { normalizeEmails } from './email-normalizer.service';

describe('email-normalizer', () => {
  describe('normalizeEmails', () => {
    it('returns an empty string for an empty input', () => {
      expect(normalizeEmails('')).toBe('');
    });

    it('normalizes gmail addresses by removing dots and plus suffixes', () => {
      expect(normalizeEmails('John.Doe+tag@gmail.com')).toBe('johndoe@gmail.com');
      expect(normalizeEmails('j.o.h.n.d.o.e@gmail.com')).toBe('johndoe@gmail.com');
      expect(normalizeEmails('johndoe+spam+filter@gmail.com')).toBe('johndoe@gmail.com');
    });

    it('normalizes googlemail addresses to gmail', () => {
      expect(normalizeEmails('foo.bar+baz@googlemail.com')).toBe('foobar@gmail.com');
    });

    it('lowercases addresses and strips plus suffixes for outlook', () => {
      expect(normalizeEmails('User+Tag@Outlook.COM')).toBe('user@outlook.com');
    });

    it('keeps dots for providers where dots are significant', () => {
      expect(normalizeEmails('user.name+x@yahoo.com')).toBe('user.name+x@yahoo.com');
    });

    it('normalizes multiple emails, one per line', () => {
      const input = 'John.Doe+tag@gmail.com\nUser+Tag@Outlook.COM';

      expect(normalizeEmails(input)).toBe('johndoe@gmail.com\nuser@outlook.com');
    });

    it('reports unparseable emails inline without dropping other lines', () => {
      const input = 'John.Doe@gmail.com\nnot-an-email\nfoo.bar@googlemail.com';

      expect(normalizeEmails(input)).toBe('johndoe@gmail.com\nUnable to parse email: not-an-email\nfoobar@gmail.com');
    });
  });
});
