<script setup lang="ts">
import { inspectString } from './unicode-inspector.service';

const input = ref('Hi 👋');

const characters = computed(() => inspectString(input.value));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      label="Text to inspect"
      placeholder="Type or paste text to inspect its characters..."
      multiline
      rows="3"
      raw-text
      monospace
    />

    <c-card v-if="characters.length > 0" mt-4>
      <n-table :bordered="false" :single-line="false" size="small">
        <thead>
          <tr>
            <th>Char</th>
            <th>Unicode</th>
            <th>Decimal</th>
            <th>HTML</th>
            <th>UTF-8</th>
            <th>UTF-16</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in characters" :key="index">
            <td class="char-cell">
              {{ info.char === ' ' ? '␠' : info.char }}
            </td>
            <td monospace>
              {{ info.unicode }}
            </td>
            <td monospace>
              {{ info.decimal }}
            </td>
            <td monospace>
              {{ info.htmlEntity }}
            </td>
            <td monospace>
              {{ info.utf8 }}
            </td>
            <td monospace>
              {{ info.utf16 }}
            </td>
            <td op-70>
              {{ info.name }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>

    <div mt-3 op-70>
      {{ characters.length }} character{{ characters.length === 1 ? '' : 's' }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.char-cell {
  font-size: 20px;
  text-align: center;
}
</style>
