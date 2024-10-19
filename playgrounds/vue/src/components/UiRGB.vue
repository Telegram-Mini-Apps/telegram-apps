<script setup lang="ts">
import { defineProps } from 'vue';
import { type RGB } from '@telegram-apps/sdk-vue';

defineProps<{
  color: RGB
}>();
</script>

<template>
  <span class="rgb">
    <i class="rgb__icon" :style="{ 'background-color': color }" />
    {{color}}
  </span>
</template>

<style scoped>
.rgb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.rgb__icon {
  width: 18px;
  aspect-ratio: 1;
  border: 1px solid #555;
  border-radius: 50%;
}
</style>