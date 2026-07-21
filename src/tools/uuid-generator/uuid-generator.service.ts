import { v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid';

export { generateUuids, isValidUuid, uuidVersions };
export type { UuidVersion };

const uuidVersions = ['NIL', 'v1', 'v3', 'v4', 'v5'] as const;
type UuidVersion = typeof uuidVersions[number];

function isValidUuid(value: string): boolean {
  if (value === nilUuid) {
    return true;
  }

  return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
}

function generateUuids({
  version,
  count = 1,
  namespace = '',
  name = '',
}: {
  version: UuidVersion;
  count?: number;
  namespace?: string;
  name?: string;
}): string[] {
  const generators = {
    NIL: () => nilUuid,
    v1: (index: number) => generateUuidV1({
      clockseq: index,
      msecs: Date.now(),
      nsecs: Math.floor(Math.random() * 10000),
      node: Uint8Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)),
    }),
    v3: () => generateUuidV3(name, namespace),
    v4: () => generateUuidV4(),
    v5: () => generateUuidV5(name, namespace),
  };

  return Array.from({ length: count }, (_ignored, index) => {
    const generator = generators[version] ?? generators.NIL;
    return generator(index);
  });
}
