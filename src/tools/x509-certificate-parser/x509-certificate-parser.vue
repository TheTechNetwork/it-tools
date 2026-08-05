<script setup lang="ts">
import type { DistinguishedName } from './x509-certificate-parser.service';
import { formatHexColons, parseCertificate } from './x509-certificate-parser.service';

const { t } = useI18n();

const input = ref('');

const parsed = computed(() => {
  if (input.value.trim() === '') {
    return { certificate: undefined, error: undefined };
  }

  try {
    return { certificate: parseCertificate(input.value), error: undefined };
  }
  catch (error: any) {
    return { certificate: undefined, error: String(error?.message ?? error) };
  }
});

const certificate = computed(() => parsed.value.certificate);

function dnItems(dn: DistinguishedName) {
  return [
    { label: t('tools.x509-certificate-parser.commonName'), value: dn.commonName },
    { label: t('tools.x509-certificate-parser.organization'), value: dn.organizationName },
    { label: t('tools.x509-certificate-parser.organizationalUnit'), value: dn.organizationalUnitName },
    { label: t('tools.x509-certificate-parser.locality'), value: dn.localityName },
    { label: t('tools.x509-certificate-parser.state'), value: dn.stateOrProvinceName },
    { label: t('tools.x509-certificate-parser.country'), value: dn.countryName },
  ].filter(item => item.value);
}

interface ValidityStatus { type: 'success' | 'warning' | 'error'; label: string }

const validityStatus = computed<ValidityStatus | undefined>(() => {
  if (!certificate.value) {
    return undefined;
  }

  const now = Date.now();
  const { notBefore, notAfter } = certificate.value.validity;

  if (now < notBefore.getTime()) {
    return { type: 'warning', label: t('tools.x509-certificate-parser.notYetValid') };
  }
  if (now > notAfter.getTime()) {
    return { type: 'error', label: t('tools.x509-certificate-parser.expired') };
  }
  return { type: 'success', label: t('tools.x509-certificate-parser.valid') };
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      multiline
      raw-text
      rows="6"
      :label="t('tools.x509-certificate-parser.inputLabel')"
      :placeholder="t('tools.x509-certificate-parser.inputPlaceholder')"
      monospace
    />

    <c-alert v-if="parsed.error" mt-3>
      {{ t('tools.x509-certificate-parser.parseError') }}
    </c-alert>

    <template v-if="certificate">
      <div grid grid-cols-1 mt-4 gap-3 md:grid-cols-2>
        <c-card :title="t('tools.x509-certificate-parser.subject')">
          <c-key-value-list :items="dnItems(certificate.subject)" />
        </c-card>

        <c-card :title="t('tools.x509-certificate-parser.issuer')">
          <c-key-value-list :items="dnItems(certificate.issuer)" />
        </c-card>
      </div>

      <c-card mt-3 :title="t('tools.x509-certificate-parser.validity')">
        <div mb-2 flex items-center gap-2>
          <n-tag v-if="validityStatus" :type="validityStatus.type" size="small">
            {{ validityStatus.label }}
          </n-tag>
        </div>
        <c-key-value-list
          :items="[
            { label: t('tools.x509-certificate-parser.notBefore'), value: certificate.validity.notBefore.toLocaleString() },
            { label: t('tools.x509-certificate-parser.notAfter'), value: certificate.validity.notAfter.toLocaleString() },
          ]"
        />
      </c-card>

      <c-card v-if="certificate.subjectAltNames.length > 0" mt-3 :title="t('tools.x509-certificate-parser.subjectAltNames')">
        <div flex flex-col gap-1>
          <c-text-copyable v-for="san in certificate.subjectAltNames" :key="san" :value="san" font-mono />
        </div>
      </c-card>

      <c-card mt-3 :title="t('tools.x509-certificate-parser.details')">
        <c-key-value-list
          :items="[
            { label: t('tools.x509-certificate-parser.version'), value: `v${certificate.version}` },
            { label: t('tools.x509-certificate-parser.serialNumber'), value: formatHexColons(certificate.serialNumber) },
            { label: t('tools.x509-certificate-parser.signatureAlgorithm'), value: certificate.signatureAlgorithm },
            { label: t('tools.x509-certificate-parser.publicKey'), value: certificate.publicKey.keySizeBits ? `${certificate.publicKey.algorithm} ${certificate.publicKey.keySizeBits} bits` : certificate.publicKey.algorithm },
            { label: t('tools.x509-certificate-parser.isCa'), value: certificate.basicConstraints.isCertificateAuthority ? t('tools.x509-certificate-parser.yes') : t('tools.x509-certificate-parser.no') },
            { label: t('tools.x509-certificate-parser.selfSigned'), value: certificate.selfSigned ? t('tools.x509-certificate-parser.yes') : t('tools.x509-certificate-parser.no') },
          ]"
        />
      </c-card>

      <c-card mt-3 :title="t('tools.x509-certificate-parser.fingerprints')">
        <div flex flex-col gap-2>
          <div>
            <div text-sm op-70>
              SHA-1
            </div>
            <c-text-copyable :value="formatHexColons(certificate.fingerprints.sha1)" break-all font-mono />
          </div>
          <div>
            <div text-sm op-70>
              SHA-256
            </div>
            <c-text-copyable :value="formatHexColons(certificate.fingerprints.sha256)" break-all font-mono />
          </div>
        </div>
      </c-card>
    </template>
  </div>
</template>
