export { convertDuration, DURATION_UNITS, humanizeDuration };
export type { DurationUnit };

interface DurationUnit {
  key: string;
  label: string;
  // Number of milliseconds in one unit.
  milliseconds: number;
}

const MS = 1;
const SECOND = 1000 * MS;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const DURATION_UNITS: DurationUnit[] = [
  { key: 'nanosecond', label: 'Nanoseconds (ns)', milliseconds: 1e-6 },
  { key: 'microsecond', label: 'Microseconds (µs)', milliseconds: 1e-3 },
  { key: 'millisecond', label: 'Milliseconds (ms)', milliseconds: MS },
  { key: 'second', label: 'Seconds (s)', milliseconds: SECOND },
  { key: 'minute', label: 'Minutes (min)', milliseconds: MINUTE },
  { key: 'hour', label: 'Hours (h)', milliseconds: HOUR },
  { key: 'day', label: 'Days (d)', milliseconds: DAY },
  { key: 'week', label: 'Weeks (w)', milliseconds: WEEK },
];

const UNIT_BY_KEY = new Map(DURATION_UNITS.map(unit => [unit.key, unit]));

function convertDuration({ value, from, to }: { value: number; from: string; to: string }): number {
  const fromUnit = UNIT_BY_KEY.get(from);
  const toUnit = UNIT_BY_KEY.get(to);

  if (!fromUnit || !toUnit) {
    throw new Error(`Unknown duration unit: ${!fromUnit ? from : to}`);
  }

  return (value * fromUnit.milliseconds) / toUnit.milliseconds;
}

// Break a duration (given in one unit) down into a human-readable string such
// as "1 hour, 2 minutes, 3 seconds". Sub-millisecond remainders are dropped.
function humanizeDuration({ value, from }: { value: number; from: string }): string {
  const fromUnit = UNIT_BY_KEY.get(from);
  if (!fromUnit) {
    throw new Error(`Unknown duration unit: ${from}`);
  }

  let remainingMs = Math.abs(value * fromUnit.milliseconds);
  const sign = value < 0 ? '-' : '';

  if (remainingMs === 0) {
    return '0 milliseconds';
  }

  const parts: string[] = [];
  const breakdown: { label: string; ms: number }[] = [
    { label: 'week', ms: WEEK },
    { label: 'day', ms: DAY },
    { label: 'hour', ms: HOUR },
    { label: 'minute', ms: MINUTE },
    { label: 'second', ms: SECOND },
    { label: 'millisecond', ms: MS },
  ];

  for (const { label, ms } of breakdown) {
    const count = Math.floor(remainingMs / ms);
    if (count > 0) {
      parts.push(`${count} ${label}${count > 1 ? 's' : ''}`);
      remainingMs -= count * ms;
    }
  }

  if (parts.length === 0) {
    return `${sign}less than 1 millisecond`;
  }

  return sign + parts.join(', ');
}
