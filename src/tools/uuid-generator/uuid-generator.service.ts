import {
  v1 as generateUuidV1,
  v3 as generateUuidV3,
  v4 as generateUuidV4,
  v5 as generateUuidV5,
  v6 as generateUuidV6,
  v7 as generateUuidV7,
  NIL as nilUuid,
  validate as validateUuid,
} from 'uuid';

export { generateUuids, isValidUuid, uuidVersions };
export type { UuidVersion };

const uuidVersions = ['NIL', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7'] as const;
type UuidVersion = typeof uuidVersions[number];

function isValidUuid(value: string): boolean {
  // uuid's validate() accepts every RFC 9562 version (1-8) and the nil UUID,
  // so v6/v7 identifiers validate too (the old hand-rolled regex only allowed
  // versions 1-5).
  return validateUuid(value);
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
    v6: () => generateUuidV6(),
    v7: () => generateUuidV7(),
  };

  return Array.from({ length: count }, (_ignored, index) => {
    const generator = generators[version] ?? generators.NIL;
    return generator(index);
  });
}
