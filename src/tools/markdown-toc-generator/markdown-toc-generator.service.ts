export { generateToc, slugify };
export type { TocOptions };

interface TocOptions {
  // Only include headings between these levels (inclusive).
  minLevel?: number;
  maxLevel?: number;
  // Indentation unit for nested list items.
  indent?: string;
  // Marker for list items ('-', '*' or '1.' for an ordered list).
  bullet?: string;
}

interface Heading {
  level: number;
  text: string;
  slug: string;
}

// GitHub-style anchor slug: lowercase, spaces to hyphens, drop characters that
// are not word characters/hyphens/spaces.
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s+/g, '-');
}

function parseHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();
  let inFence = false;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();

    // Toggle fenced code blocks so `# comments` inside them are ignored.
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = /^(#{1,6})[ \t](.*)$/.exec(line);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    // Strip an optional closing sequence of hashes ("## Title ##").
    const text = match[2].replace(/\s+#+\s*$/, '').trim();

    let slug = slugify(text);
    // GitHub disambiguates duplicate slugs with -1, -2, ...
    const count = slugCounts.get(slug) ?? 0;
    slugCounts.set(slug, count + 1);
    if (count > 0) {
      slug = `${slug}-${count}`;
    }

    headings.push({ level, text, slug });
  }

  return headings;
}

function generateToc(markdown: string, options: TocOptions = {}): string {
  const { minLevel = 1, maxLevel = 6, indent = '  ', bullet = '-' } = options;

  const headings = parseHeadings(markdown).filter(
    heading => heading.level >= minLevel && heading.level <= maxLevel,
  );

  if (headings.length === 0) {
    return '';
  }

  const baseLevel = Math.min(...headings.map(heading => heading.level));
  const ordered = bullet.trim().endsWith('.');

  return headings
    .map((heading) => {
      const depth = heading.level - baseLevel;
      const marker = ordered ? '1.' : bullet;
      return `${indent.repeat(depth)}${marker} [${heading.text}](#${heading.slug})`;
    })
    .join('\n');
}
