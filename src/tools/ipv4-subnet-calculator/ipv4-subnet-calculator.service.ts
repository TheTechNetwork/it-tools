import { Netmask } from 'netmask';

export { getNetworkInfo, getNetworkMaskInBinary };

function getNetworkInfo(address: string) {
  return new Netmask(address.trim());
}

function getNetworkMaskInBinary({ bitmask }: { bitmask: number }): string {
  return ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '';
}
