<script setup lang="ts">
import { onMounted, onBeforeUnmount, withDefaults } from 'vue';
import { useRouter } from 'vue-router';
import { backButton } from '@telegram-apps/sdk-vue';

const props = withDefaults(defineProps<{
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean;
  title: string;
}>(), {
  back: true,
});

const router = useRouter();

onMounted(() => {
  if (props.back) {
    backButton.show();
    const unsub = backButton.onClick(() => {
      router.go(-1);
    });
    onBeforeUnmount(unsub);
  } else {
    backButton.hide();
  }
});
</script>

<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <div v-if="$slots.disclaimer" class="page__disclaimer">
      <slot name="disclaimer" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.page {
  padding: 0 10px;
  box-sizing: border-box;
}

.page__disclaimer {
  margin-bottom: 16px;
}
</style>