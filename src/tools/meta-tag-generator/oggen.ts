// Open Graph / Twitter <meta> generator, vendored from the (unmaintained,
// zero-dependency) @it-tools/oggen package (MIT, CorentinTh) to drop the
// abandoned dependency. Ported verbatim from its dist - behaviour is unchanged
// (including that it emits `value="..."` rather than `content="..."`).

export type { MetadataConfig, MetadataValue };
export { generateMeta };

type MetadataValue = boolean | string | Date | number;

interface MetadataConfig {
  [key: string]: MetadataValue | MetadataValue[] | MetadataConfig;
}

interface FlatMeta {
  key: string;
  value: string;
}

const twitterCompatibility: Record<string, string> = {
  'og:description': 'twitter:description',
  'og:title': 'twitter:title',
  'og:image': 'twitter:image',
  'og:image:url': 'twitter:image',
  'og:image:alt': 'twitter:image:alt',
};

function generateMeta(
  { twitter: twitterMetadataRaw, ...ogMetadataRaw }: MetadataConfig,
  { indentation = 0, indentWith = '  ', generateTwitterCompatibleMeta = false }: { indentation?: number; indentWith?: string; generateTwitterCompatibleMeta?: boolean } = {},
): string {
  const ogMetadataFlat = flattenMetadata(ogMetadataRaw, { basePrefix: 'og' });
  const twitterMetadataFlat = flattenMetadata(twitterMetadataRaw, { basePrefix: 'twitter' });

  const metaStringGroups = [
    generateMetaForType({ title: 'og meta', flatMetadata: ogMetadataFlat, type: 'property' }),
    generateMetaForType({
      title: 'twitter meta',
      flatMetadata: [
        ...twitterMetadataFlat,
        ...(generateTwitterCompatibleMeta ? pickTwitterCompatibleMetadata({ existingMeta: ogMetadataFlat, twitterMeta: twitterMetadataFlat }) : []),
      ],
      type: 'name',
    }),
  ];

  return metaStringGroups
    .filter(group => group && group.length > 0)
    .map(group => group.map(str => indentWith.repeat(indentation) + str).join('\n'))
    .join('\n\n');
}

function pickTwitterCompatibleMetadata({ existingMeta, twitterMeta }: { existingMeta: FlatMeta[]; twitterMeta: FlatMeta[] }): FlatMeta[] {
  return existingMeta
    .filter(({ key }) => key in twitterCompatibility && twitterMeta.find(tm => tm.key === twitterCompatibility[key]) === undefined)
    .map(({ key, value }) => ({ key: twitterCompatibility[key] ?? key, value }));
}

function generateMetaForType({ title, flatMetadata, type }: { title: string; flatMetadata: FlatMeta[]; type: string }): string[] {
  if (flatMetadata.length === 0) {
    return [];
  }

  return [`<!-- ${title} -->`, ...buildMetaStrings({ flatMetadata, type })];
}

function buildMetaStrings({ flatMetadata, type }: { flatMetadata: FlatMeta[]; type: string }): string[] {
  return flatMetadata.map(item => metaToString({ flatMetadata: item, type }));
}

function metaToString({ flatMetadata: { key, value }, type }: { flatMetadata: FlatMeta; type: string }): string {
  return `<meta ${type.trim()}="${key.trim()}" value="${value.trim()}" />`;
}

function flattenMetadata(metadata: unknown, { separator = ':', basePrefix = '' }: { separator?: string; basePrefix?: string } = {}): FlatMeta[] {
  const acc: FlatMeta[] = [];

  const walk = (node: unknown, prefix = '') => {
    if (node === undefined || node === '') {
      return;
    }

    if (isObject(node)) {
      for (const [key, value] of Object.entries(node)) {
        const prefixedKey = [prefix, toSnakeCase(key)].filter(Boolean).join(separator);
        walk(value, prefixedKey);
      }
    }
    else if (Array.isArray(node)) {
      for (const value of node) {
        walk(value, prefix);
      }
    }
    else {
      acc.push({ key: prefix, value: stringifyValue(node as MetadataValue) });
    }
  };

  walk(metadata, basePrefix);

  return acc;
}

function stringifyValue(value: MetadataValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !Array.isArray(value) && value !== null && !(value instanceof Date);
}

function toSnakeCase(str: string): string {
  return str.split(':').map(toSnakeCaseStrict).join(':');
}

function toSnakeCaseStrict(str: string): string {
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z]|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)?.map(part => part.toLowerCase()).join('_') ?? '';
}
