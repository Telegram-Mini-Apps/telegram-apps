<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { openLink } from '@telegram-apps/sdk-vue';

const props = defineProps<{
  to: RouteLocationRaw;
  inactiveClass?: string;
  // Add other props from RouterLink if needed
}>();

const isExternalLink = computed(() => {
  if (typeof props.to !== 'string') {
    return false;
  }

  // props.to is now guaranteed to be a string here
  const targetUrl = new URL(props.to, window.location.toString());
  const currentUrl = new URL(window.location.toString());

  return targetUrl.protocol !== currentUrl.protocol || targetUrl.host !== currentUrl.host;
});

function onExternalLinkClick() {
  // Cast to string as openLink likely expects a string
  openLink(props.to as string);
}
</script>

<template>
  <a
      v-if="isExternalLink"
      v-bind="$attrs"
      class="link"
      :href="props.to.toString()"
      @click.prevent="onExternalLinkClick"
  >
    <slot />
  </a>
  <RouterLink
      v-else
      :to="props.to"
      class="link"
      v-bind="$attrs"
  >
    <slot />
  </RouterLink>
</template>

<style scoped>
.link {
  text-decoration: none;
  color: var(--tg-theme-link-color);
}
</style>
