import slugify from '@sindresorhus/slugify';

export { slugifyString };

function slugifyString(input: string): string {
  return slugify(input);
}
