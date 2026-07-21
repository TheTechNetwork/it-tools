// The package.json "exports" field of @it-tools/oggen does not expose its type
// declarations, so we re-declare the parts of its public API used by this tool.
declare module '@it-tools/oggen' {
  type MetadataValue = boolean | string | Date | number;

  interface MetadataConfig {
    [key: string]: MetadataValue | MetadataValue[] | MetadataConfig;
  }

  function generateMeta(
    metadata: MetadataConfig,
    options?: {
      indentation?: number;
      indentWith?: string;
      generateTwitterCompatibleMeta?: boolean;
    },
  ): string;

  export { generateMeta };
  export type { MetadataConfig, MetadataValue };
}
