<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({ title: 'About - IT Tools' });
</script>

<template>
  <c-markdown :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
</template>
