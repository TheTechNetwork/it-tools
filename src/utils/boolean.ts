export function isNotThrowing(cb: () => unknown): boolean {
  try {
    cb();
    return true;
  }
  catch {
    return false;
  }
}

export function booleanToHumanReadable(value: boolean): string {
  return value ? 'Yes' : 'No';
}
