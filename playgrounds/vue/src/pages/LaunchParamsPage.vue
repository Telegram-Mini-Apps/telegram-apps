<script setup lang="ts">
import { h } from 'vue';
import { useLaunchParams } from '@telegram-apps/sdk-vue';
import UiLink from '@/components/UiLink.vue';
import UiPage from '@/components/UiPage.vue';
import UiDisplayData, { type DisplayDataRow } from '@/components/UiDisplayData.vue';

const lp = useLaunchParams();

const rows: DisplayDataRow[] = [
  { title: 'tgWebAppPlatform', value: lp.platform },
  { title: 'tgWebAppShowSettings', value: lp.showSettings },
  { title: 'tgWebAppVersion', value: lp.version },
  { title: 'tgWebAppBotInline', value: lp.botInline },
  { title: 'tgWebAppStartParam', value: lp.startParam },
  { title: 'tgWebAppData', value: { render: () => h(UiLink, { to: { name: 'init-data' } }, { default: () => 'View' }) } },
  { title: 'tgWebAppThemeParams', value: { render: () => h(UiLink, { to: { name: 'theme-params' } }, { default: () => 'View' }) } },
];
</script>

<template>
  <UiPage title="Launch Params">
    <template #disclaimer>
      This page displays application <UiLink to="https://docs.telegram-mini-apps.com/platform/launch-parameters">
        launch params</UiLink>.
    </template>
    <UiDisplayData :rows />
  </UiPage>
</template>