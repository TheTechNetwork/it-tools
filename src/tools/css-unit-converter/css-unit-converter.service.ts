export type CssUnit = 'px' | 'rem' | 'em' | 'pt' | 'pc' | 'in' | 'cm' | 'mm' | '%';

export const CSS_UNITS: { value: CssUnit; label: string }[] = [
  { value: 'px', label: 'px — pixels' },
  { value: 'rem', label: 'rem — root em' },
  { value: 'em', label: 'em — element em' },
  { value: '%', label: '% — percent of base font size' },
  { value: 'pt', label: 'pt — points' },
  { value: 'pc', label: 'pc — picas' },
  { value: 'in', label: 'in — inches' },
  { value: 'cm', label: 'cm — centimeters' },
  { value: 'mm', label: 'mm — millimeters' },
];

// Number of CSS pixels in one unit, for the absolute units. Font-relative
// units (rem, em, %) depend on the reference font size and are handled apart.
const ABSOLUTE_PX_PER_UNIT: Record<Exclude<CssUnit, 'rem' | 'em' | '%'>, number> = {
  px: 1,
  pt: 96 / 72,
  pc: 16,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
};

function toPx({ value, unit, baseFontSize }: { value: number; unit: CssUnit; baseFontSize: number }): number {
  if (unit === 'rem' || unit === 'em') {
    return value * baseFontSize;
  }
  if (unit === '%') {
    return (value / 100) * baseFontSize;
  }
  return value * ABSOLUTE_PX_PER_UNIT[unit];
}

function fromPx({ px, unit, baseFontSize }: { px: number; unit: CssUnit; baseFontSize: number }): number {
  if (unit === 'rem' || unit === 'em') {
    return px / baseFontSize;
  }
  if (unit === '%') {
    return (px / baseFontSize) * 100;
  }
  return px / ABSOLUTE_PX_PER_UNIT[unit];
}

export function convertCssUnit({
  value,
  from,
  to,
  baseFontSize = 16,
}: {
  value: number;
  from: CssUnit;
  to: CssUnit;
  baseFontSize?: number;
}): number {
  if (!Number.isFinite(value) || !Number.isFinite(baseFontSize) || baseFontSize <= 0) {
    return Number.NaN;
  }

  const px = toPx({ value, unit: from, baseFontSize });
  return fromPx({ px, unit: to, baseFontSize });
}
