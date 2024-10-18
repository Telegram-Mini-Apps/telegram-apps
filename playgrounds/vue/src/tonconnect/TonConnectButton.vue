<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTonConnectUI } from './useTonConnectUI';

const props = withDefaults(defineProps<{
  id?: string
}>(), { id: 'tonconnect-button' });

const { setTonConnectUIOptions } = useTonConnectUI();

onMounted(() => {
  setTonConnectUIOptions({ buttonRootId: props.id });
});

onUnmounted(() => {
  setTonConnectUIOptions({ buttonRootId: null });
});
</script>

<template>
  <div :id :style="{ width: 'fit-content' }"></div>
</template>