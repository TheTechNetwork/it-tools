import { sha1 } from '@awasm/noble';
import { bytesToHex, utf8ToBytes } from '@awasm/noble/utils.js';

export { generateUla };

function generateUla({ macAddress, timestamp = Date.now() }: { macAddress: string; timestamp?: number }) {
  // RFC 4193 section 3.2.2 mandates SHA-1 for deriving the ULA Global ID;
  // this is pseudo-random ID generation, not a security control.
  const hex40bit = bytesToHex(sha1(utf8ToBytes(`${timestamp}${macAddress}`)))
    .substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return {
    ula: `${ula}::/48`,
    firstRoutableBlock: `${ula}:0::/64`,
    lastRoutableBlock: `${ula}:ffff::/64`,
  };
}
