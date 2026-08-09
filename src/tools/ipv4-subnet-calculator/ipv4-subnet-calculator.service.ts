import { Netmask } from 'netmask';

export function getNetworkInfo(address: string) {
  return new Netmask(address.trim());
}

export function getNetworkMaskInBinary({ bitmask }: { bitmask: number }): string {
  return ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '';
}
