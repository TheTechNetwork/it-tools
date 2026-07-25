<script setup lang="ts">
// @ts-nocheck
import type { SignatureInfo } from '../pdf-signature-checker.types';

const props = defineProps<{ signature: SignatureInfo }>();
const { signature } = toRefs(props);

const { t } = useI18n();

const tableHeaders = computed(() => ({
  validityPeriod: t('tools.pdf-signature-checker.details.validityPeriod'),
  issuedBy: t('tools.pdf-signature-checker.details.issuedBy'),
  issuedTo: t('tools.pdf-signature-checker.details.issuedTo'),
  pemCertificate: t('tools.pdf-signature-checker.details.pemCertificate'),
}));

const certs = computed(() => signature.value.meta.certs.map((certificate, index) => ({
  ...certificate,
  validityPeriod: {
    notBefore: new Date(certificate.validityPeriod.notBefore).toLocaleString(),
    notAfter: new Date(certificate.validityPeriod.notAfter).toLocaleString(),
  },
  certificateName: t('tools.pdf-signature-checker.details.certificateName', { number: index + 1 }),
})),
);
</script>

<template>
  <div flex flex-col gap-2>
    <c-table :data="certs" :headers="tableHeaders">
      <template #validityPeriod="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-checker.details.notBefore'),
            value: value.notBefore,
          }, {
            label: t('tools.pdf-signature-checker.details.notAfter'),
            value: value.notAfter,
          }]"
        />
      </template>

      <template #issuedBy="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-checker.details.commonName'),
            value: value.commonName,
          }, {
            label: t('tools.pdf-signature-checker.details.organizationName'),
            value: value.organizationName,
          }, {
            label: t('tools.pdf-signature-checker.details.countryName'),
            value: value.countryName,
          }, {
            label: t('tools.pdf-signature-checker.details.localityName'),
            value: value.localityName,
          }, {
            label: t('tools.pdf-signature-checker.details.organizationalUnitName'),
            value: value.organizationalUnitName,
          }, {
            label: t('tools.pdf-signature-checker.details.stateOrProvinceName'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #issuedTo="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-checker.details.commonName'),
            value: value.commonName,
          }, {
            label: t('tools.pdf-signature-checker.details.organizationName'),
            value: value.organizationName,
          }, {
            label: t('tools.pdf-signature-checker.details.countryName'),
            value: value.countryName,
          }, {
            label: t('tools.pdf-signature-checker.details.localityName'),
            value: value.localityName,
          }, {
            label: t('tools.pdf-signature-checker.details.organizationalUnitName'),
            value: value.organizationalUnitName,
          }, {
            label: t('tools.pdf-signature-checker.details.stateOrProvinceName'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #pemCertificate="{ value }">
        <c-modal-value :value="value" :label="t('tools.pdf-signature-checker.details.viewPemCert')">
          <template #value>
            <div break-all text-xs>
              {{ value }}
            </div>
          </template>
        </c-modal-value>
      </template>
    </c-table>
  </div>
</template>
