<script setup lang="ts">
import lookup from 'country-code-lookup';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import {
  getDefaultCountryCode,
  parsePhoneNumberDetails,
} from './phone-parser-and-formatter.service';

const rawPhone = ref('');
const defaultCountryCode = ref(getDefaultCountryCode());
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: (value: string) => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: 'Invalid phone number',
    },
  ],
});

const parsedDetails = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  return withDefaultOnError(
    () => parsePhoneNumberDetails({ phoneNumber: rawPhone.value, defaultCountryCode: defaultCountryCode.value }),
    undefined,
  );
});

const countriesOptions = getCountries().map(code => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" label="Default country code:" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      placeholder="Enter a phone number"
      label="Phone number:"
      :validation="validation"
      mb-5
    />

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td font-bold>
            {{ label }}
          </td>
          <td>
            <span-copyable v-if="value" :value="value" />
            <span v-else op-70>
              Unknown
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
