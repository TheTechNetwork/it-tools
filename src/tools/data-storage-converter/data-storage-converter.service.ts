export { convertDataSize, DATA_UNITS };
export type { DataUnit };

interface DataUnit {
  key: string;
  label: string;
  // Number of bytes in one unit.
  bytes: number;
}

// SI (decimal, powers of 1000) and IEC (binary, powers of 1024) units, plus
// the bit as the smallest unit (1 byte = 8 bits).
const DATA_UNITS: DataUnit[] = [
  { key: 'bit', label: 'Bit (b)', bytes: 1 / 8 },
  { key: 'byte', label: 'Byte (B)', bytes: 1 },
  { key: 'kilobyte', label: 'Kilobyte (kB)', bytes: 1e3 },
  { key: 'megabyte', label: 'Megabyte (MB)', bytes: 1e6 },
  { key: 'gigabyte', label: 'Gigabyte (GB)', bytes: 1e9 },
  { key: 'terabyte', label: 'Terabyte (TB)', bytes: 1e12 },
  { key: 'petabyte', label: 'Petabyte (PB)', bytes: 1e15 },
  { key: 'kibibyte', label: 'Kibibyte (KiB)', bytes: 1024 },
  { key: 'mebibyte', label: 'Mebibyte (MiB)', bytes: 1024 ** 2 },
  { key: 'gibibyte', label: 'Gibibyte (GiB)', bytes: 1024 ** 3 },
  { key: 'tebibyte', label: 'Tebibyte (TiB)', bytes: 1024 ** 4 },
  { key: 'pebibyte', label: 'Pebibyte (PiB)', bytes: 1024 ** 5 },
];

const UNIT_BY_KEY = new Map(DATA_UNITS.map(unit => [unit.key, unit]));

function convertDataSize({ value, from, to }: { value: number; from: string; to: string }): number {
  const fromUnit = UNIT_BY_KEY.get(from);
  const toUnit = UNIT_BY_KEY.get(to);

  if (!fromUnit || !toUnit) {
    throw new Error(`Unknown data unit: ${!fromUnit ? from : to}`);
  }

  return (value * fromUnit.bytes) / toUnit.bytes;
}
