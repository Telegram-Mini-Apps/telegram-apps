<script setup lang="ts">
import { computed } from 'vue';
import { themeParams, useSignal } from '@telegram-apps/sdk-vue';
import UiDisplayData, { type DisplayDataRow } from '@/components/UiDisplayData.vue';
import UiLink from '@/components/UiLink.vue';
import UiPage from '@/components/UiPage.vue';

const tp = useSignal(themeParams.state);

const rows = computed<DisplayDataRow[]>(() => Object
  .entries(tp.value)
  .map(([title, value]) => ({
    title: title
      .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
      .replace(/background/, 'bg'),
    value,
  })));
</script>

<template>
  <UiPage title="Theme Params">
    <template #disclaimer>
      This page displays current <UiLink to="https://docs.telegram-mini-apps.com/platform/theming">theme params
      </UiLink>.
    </template>
    <UiDisplayData :rows />
  </UiPage>
</template>