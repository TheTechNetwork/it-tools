import type { CountryCode, NumberType } from 'libphonenumber-js';
import lookup from 'country-code-lookup';
import { parsePhoneNumber } from 'libphonenumber-js/max';
import { booleanToHumanReadable } from '@/utils/boolean';

export { formatTypeToHumanReadable, getDefaultCountryCode, getFullCountryName, parsePhoneNumberDetails };

const typeToLabel: Record<NonNullable<NumberType>, string> = {
  MOBILE: 'Mobile',
  FIXED_LINE: 'Fixed line',
  FIXED_LINE_OR_MOBILE: 'Fixed line or mobile',
  PERSONAL_NUMBER: 'Personal number',
  PREMIUM_RATE: 'Premium rate',
  SHARED_COST: 'Shared cost',
  TOLL_FREE: 'Toll free',
  UAN: 'Universal access number',
  VOICEMAIL: 'Voicemail',
  VOIP: 'VoIP',
  PAGER: 'Pager',
};

function formatTypeToHumanReadable(type: NumberType): string | undefined {
  if (!type) {
    return undefined;
  }

  return typeToLabel[type];
}

function getFullCountryName(countryCode: string | undefined) {
  if (!countryCode) {
    return undefined;
  }

  return lookup.byIso(countryCode)?.country;
}

function getDefaultCountryCode({
  locale = window.navigator.language,
  defaultCode = 'FR',
}: { locale?: string; defaultCode?: CountryCode } = {}): CountryCode {
  const countryCode = locale.split('-')[1]?.toUpperCase();

  if (!countryCode) {
    return defaultCode;
  }

  return (lookup.byIso(countryCode)?.iso2 ?? defaultCode) as CountryCode;
}

function parsePhoneNumberDetails({ phoneNumber, defaultCountryCode }: { phoneNumber: string; defaultCountryCode?: CountryCode }) {
  const parsed = parsePhoneNumber(phoneNumber, defaultCountryCode);

  return [
    {
      label: 'Country',
      value: parsed.country,
    },
    {
      label: 'Country',
      value: getFullCountryName(parsed.country),
    },
    {
      label: 'Country calling code',
      value: parsed.countryCallingCode,
    },
    {
      label: 'Is valid?',
      value: booleanToHumanReadable(parsed.isValid()),
    },
    {
      label: 'Is possible?',
      value: booleanToHumanReadable(parsed.isPossible()),
    },
    {
      label: 'Type',
      value: formatTypeToHumanReadable(parsed.getType()),
    },
    {
      label: 'International format',
      value: parsed.formatInternational(),
    },
    {
      label: 'National format',
      value: parsed.formatNational(),
    },
    {
      label: 'E.164 format',
      value: parsed.format('E.164'),
    },
    {
      label: 'RFC3966 format',
      value: parsed.format('RFC3966'),
    },
  ];
}
