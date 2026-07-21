<script setup lang="ts">
import { codesByCategories } from './http-status-codes.constants';
import { searchHttpStatusCodes } from './http-status-codes.service';

const search = ref('');

const codesByCategoryFiltered = computed(() => {
  if (!search.value) {
    return codesByCategories;
  }

  return [{ category: 'Search results', codes: searchHttpStatusCodes(search.value) }];
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="search"
      placeholder="Search http status..."
      autofocus raw-text mb-10
    />

    <div v-for="{ codes, category } of codesByCategoryFiltered" :key="category" mb-8>
      <div mb-2 text-xl>
        {{ category }}
      </div>

      <c-card v-for="{ code, description, name, type } of codes" :key="code" mb-2>
        <div text-lg font-bold>
          {{ code }} {{ name }}
        </div>
        <div op-70>
          {{ description }} {{ type !== 'HTTP' ? `For ${type}.` : '' }}
        </div>
      </c-card>
    </div>
  </div>
</template>
