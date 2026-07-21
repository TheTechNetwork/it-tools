export { calculatePercentageChange, calculatePercentageOfNumber, calculateWhatPercentageOf };

function calculatePercentageOfNumber({ percentage, value }: { percentage: number; value: number }): string {
  return (percentage / 100 * value).toString();
}

function calculateWhatPercentageOf({ value, total }: { value: number; total: number }): string {
  const result = 100 * value / total;
  return (!Number.isFinite(result) || Number.isNaN(result)) ? '' : result.toString();
}

function calculatePercentageChange({ from, to }: { from: number; to: number }): string {
  const result = (to - from) / from * 100;
  return (!Number.isFinite(result) || Number.isNaN(result)) ? '' : result.toString();
}
