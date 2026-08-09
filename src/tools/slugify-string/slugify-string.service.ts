import slugify from '@sindresorhus/slugify';

export function slugifyString(
  input: string,
  { separator = '-', lowercase = true }: { separator?: string; lowercase?: boolean } = {},
): string {
  return slugify(input, { separator, lowercase });
}
