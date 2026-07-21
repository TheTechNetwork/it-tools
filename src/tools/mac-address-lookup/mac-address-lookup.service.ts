import db from 'oui-data';

export { getVendorValue, lookupMacAddressVendor };

function getVendorValue(address: string) {
  return address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);
}

function lookupMacAddressVendor(address: string): string | undefined {
  return (db as Record<string, string>)[getVendorValue(address)];
}
