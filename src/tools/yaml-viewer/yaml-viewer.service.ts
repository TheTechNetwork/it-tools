import yaml from 'yaml';

export function formatYaml({
  rawYaml,
  sortKeys = false,
  indentSize = 2,
}: {
  rawYaml: string;
  sortKeys?: boolean;
  indentSize?: number;
}): string {
  const parsedYaml = yaml.parse(rawYaml);

  const formattedYAML = yaml.stringify(parsedYaml, {
    sortMapEntries: sortKeys,
    indent: indentSize,
  });

  return formattedYAML;
}
