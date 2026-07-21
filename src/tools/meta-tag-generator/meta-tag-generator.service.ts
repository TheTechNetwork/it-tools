import type { MetadataConfig } from '@it-tools/oggen';
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';

export { generateMetaTags };

function generateMetaTags(metadata: Record<string, unknown>): string {
  const twitterMeta = _.chain(metadata)
    .pickBy((_value, k) => k.startsWith('twitter:'))
    .mapKeys((_value, k) => k.replace(/^twitter:/, ''))
    .value();

  const otherMeta = _.pickBy(metadata, (_value, k) => !k.startsWith('twitter:'));

  return generateMeta({ ...otherMeta, twitter: twitterMeta } as MetadataConfig, { generateTwitterCompatibleMeta: true });
}
