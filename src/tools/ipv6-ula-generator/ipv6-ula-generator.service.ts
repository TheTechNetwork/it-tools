import { SHA1 } from 'crypto-js';

export { generateUla };

function generateUla({ macAddress, timestamp = Date.now() }: { macAddress: string; timestamp?: number }) {
  const hex40bit = SHA1(timestamp + macAddress)
    .toString()
    .substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return {
    ula: `${ula}::/48`,
    firstRoutableBlock: `${ula}:0::/64`,
    lastRoutableBlock: `${ula}:ffff::/64`,
  };
}
