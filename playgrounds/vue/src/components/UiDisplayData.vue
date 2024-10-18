<script lang="ts">
import { type RGB } from '@telegram-apps/sdk-vue';
import { type Component } from 'vue';

export interface DisplayDataRow {
  title: string;
  value?: RGB | string | number | boolean | Component;
};

export interface DisplayDataProps {
  rows: DisplayDataRow[];
};
</script>

<script setup lang="ts">
import { isRGB } from '@telegram-apps/sdk-vue';
import UiRGB from './UiRGB.vue';

defineProps<DisplayDataProps>();

function mapValueToString(value?: boolean | string) {
  switch (value) {
    case true:
      return '✔️';
    case false:
      return '❌';
    case undefined:
      return 'empty';
    default:
      return value;
  }
}
</script>

<template>
  <div>
    <div v-for="(row, idx) in rows" :key="idx" class="display-data__line">
      <span class="display-data__line-title">{{ row.title }}</span>
      <span class="display-data__line-value">
        <component v-if="typeof row.value === 'object'" :is="row.value" />
        <UiRGB v-else-if="typeof row.value === 'string' && isRGB(row.value)" :color="row.value" />
        <span v-else>{{ mapValueToString(row.value as boolean | string | undefined) }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.display-data__line {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
  flex-flow: wrap;
}

.display-data__line-title {
  border: 1px solid var(--tg-theme-accent-text-color);
  background-color: var(--tg-theme-bg-color);
  border-radius: 5px;
  padding: 2px 8px 4px;
  box-sizing: border-box;
}

.display-data__line-value {
  word-break: break-word;
}
</style>