<script lang="ts">
    import Page from '@/components/Page/Page.svelte';
    import DisplayData from '@/components/DisplayData/DisplayData.svelte';
    import { useLaunchParams } from '@telegram-apps/sdk-svelte';
    import Link from '@/components/Link/Link.svelte';
  
    const lp = useLaunchParams();
    
    const rows = [
    { title: 'tgWebAppPlatform', value: lp.platform },
    { title: 'tgWebAppShowSettings', value: lp.showSettings },
    { title: 'tgWebAppVersion', value: lp.version },
    { title: 'tgWebAppBotInline', value: lp.botInline },
    { title: 'tgWebAppStartParam', value: lp.startParam },
    { title: 'tgWebAppData', value: Link, meta: { path: '/svelte-template/init-data', title: 'View' }},
    { title: 'tgWebAppThemeParams', value: Link, meta: { path: '/svelte-template/theme-params', title: 'View' } },
    ];
  </script>
  
  <Page title="Theme Params">
    {#snippet disclaimer()}
      This page displays current theme params.
    {/snippet}
    <DisplayData {rows} />
  </Page>
  