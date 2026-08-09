import { compareSync, hashSync } from 'bcryptjs';

export function hashString({ string, saltCount }: { string: string; saltCount: number }): string {
  return hashSync(string, saltCount);
}

export function compareStringWithHash({ string, hash }: { string: string; hash: string }): boolean {
  return compareSync(string, hash);
}
