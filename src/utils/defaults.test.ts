import { describe, expect, it } from 'vitest';
import { withDefaultOnError, withDefaultOnErrorAsync } from './defaults';

describe('defaults util', () => {
  describe('withDefaultOnError', () => {
    it('should return the callback or the default one if the callback throws', () => {
      expect(withDefaultOnError(() => 'original', 'default')).to.eql('original');
    });

    expect(
      withDefaultOnError(() => {
        throw new Error('message');
      }, 'default'),
    ).to.eql('default');

    it('returns the default value when the callback throws', () => {
      expect(
        withDefaultOnError(() => {
          throw new Error('message');
        }, 'default'),
      ).to.eql('default');
    });
  });

  describe('withDefaultOnErrorAsync', () => {
    it('returns the awaited callback value when it resolves', async () => {
      expect(await withDefaultOnErrorAsync(async () => 'original', 'default')).to.eql('original');
    });

    it('returns the callback value for a synchronous (non-promise) return', async () => {
      expect(await withDefaultOnErrorAsync(() => 'sync-value', 'default')).to.eql('sync-value');
    });

    it('returns the default value when the callback throws synchronously', async () => {
      expect(
        await withDefaultOnErrorAsync(() => {
          throw new Error('boom');
        }, 'default'),
      ).to.eql('default');
    });

    it('returns the default value when the returned promise rejects', async () => {
      expect(
        await withDefaultOnErrorAsync(async () => {
          throw new Error('async boom');
        }, 'default'),
      ).to.eql('default');
    });
  });
});
