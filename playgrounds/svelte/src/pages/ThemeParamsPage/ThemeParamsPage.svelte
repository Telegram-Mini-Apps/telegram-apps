<script lang="ts">
  import Page from '@/components/Page/Page.svelte';
  import DisplayData from '@/components/DisplayData/DisplayData.svelte';
  import { useSignal, themeParams } from '@telegram-apps/sdk-svelte';
  import { derived } from 'svelte/store';

  const tp = useSignal(themeParams.state);

  const rows = derived([tp], ([$tp]) => Object
    .entries($tp)
    .map(([title, value]) => ({
      title: title
        .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
        .replace(/background/, 'bg'),
      value,
    })));
</script>

<Page title="Theme Params">
  {#snippet disclaimer()}
    This page displays application launch params.
  {/snippet}
  <DisplayData rows={$rows} />
</Page>
