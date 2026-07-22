// The OUI database is ~4 MB. Import it as a URL asset and fetch it on demand so
// it ships as a compressed, content-hashed JSON file (parsed once with native
// JSON.parse) instead of being inlined as a multi-megabyte JS object literal in
// this tool's chunk.
import ouiDataUrl from 'oui-data?url';

export type OuiData = Record<string, string>;

export { getVendorValue, loadOuiData, lookupMacAddressVendor };

let ouiDataPromise: Promise<OuiData> | undefined;

// Memoised: the database is fetched and parsed at most once per session.
function loadOuiData(): Promise<OuiData> {
  ouiDataPromise ??= fetch(ouiDataUrl).then(response => response.json() as Promise<OuiData>);
  return ouiDataPromise;
}

function getVendorValue(address: string): string {
  return address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);
}

function lookupMacAddressVendor(db: OuiData, address: string): string | undefined {
  return db[getVendorValue(address)];
}
