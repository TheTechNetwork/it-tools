export { EAPMethods, EAPPhase2Methods, escapeString, getQrCodeText, wifiEncryptions };
export type { EAPMethod, EAPPhase2Method, GetQrCodeTextOptions, WifiEncryption };

const wifiEncryptions = ['WEP', 'WPA', 'nopass', 'WPA2-EAP'] as const;
type WifiEncryption = typeof wifiEncryptions[number];

// @see https://en.wikipedia.org/wiki/Extensible_Authentication_Protocol
// for a list of available EAP methods. There are a lot (40!) of them.
const EAPMethods = [
  'MD5',
  'POTP',
  'GTC',
  'TLS',
  'IKEv2',
  'SIM',
  'AKA',
  'AKA\'',
  'TTLS',
  'PWD',
  'LEAP',
  'PSK',
  'FAST',
  'TEAP',
  'EKE',
  'NOOB',
  'PEAP',
] as const;
type EAPMethod = typeof EAPMethods[number];

const EAPPhase2Methods = [
  'None',
  'MSCHAPV2',
] as const;
type EAPPhase2Method = typeof EAPPhase2Methods[number];

interface GetQrCodeTextOptions {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  eapMethod: EAPMethod;
  isHiddenSSID: boolean;
  eapAnonymous: boolean;
  eapIdentity: string;
  eapPhase2Method: EAPPhase2Method;
}

function escapeString(str: string) {
  // replaces \, ;, ,, " and : with the same character preceded by a backslash
  return str.replace(/([\\;,:"])/g, '\\$1');
}

function getQrCodeText(options: GetQrCodeTextOptions): string | null {
  const { ssid, password, encryption, eapMethod, isHiddenSSID, eapAnonymous, eapIdentity, eapPhase2Method } = options;
  if (!ssid) {
    return null;
  }
  if (encryption === 'nopass') {
    return `WIFI:S:${escapeString(ssid)};;`; // type can be omitted in that case, and password is not needed, makes the QR Code smaller
  }
  if (encryption !== 'WPA2-EAP' && password) {
    // EAP has a lot of options, so we'll handle it separately
    // WPA and WEP are pretty simple though.
    return `WIFI:S:${escapeString(ssid)};T:${encryption};P:${escapeString(password)};${isHiddenSSID ? 'H:true' : ''};`;
  }
  if (encryption === 'WPA2-EAP' && password && eapMethod) {
    // WPA2-EAP string is a lot more complex, first off, we drop the text if there is no identity, and it's not anonymous.
    if (!eapIdentity && !eapAnonymous) {
      return null;
    }
    // From reading, I could only find that a phase 2 is required for the PEAP method, I may be wrong though, I didn't read the whole spec.
    if (eapMethod === 'PEAP' && !eapPhase2Method) {
      return null;
    }
    // The string is built in the following order:
    // 1. SSID
    // 2. Authentication type
    // 3. Password
    // 4. EAP method
    // 5. EAP phase 2 method
    // 6. Identity or anonymous if checked
    // 7. Hidden SSID if checked
    const identity = eapAnonymous ? 'A:anon' : `I:${escapeString(eapIdentity)}`;
    const phase2 = eapPhase2Method !== 'None' ? `PH2:${eapPhase2Method};` : '';
    return `WIFI:S:${escapeString(ssid)};T:WPA2-EAP;P:${escapeString(password)};E:${eapMethod};${phase2}${identity};${isHiddenSSID ? 'H:true' : ''};`;
  }
  return null;
}
