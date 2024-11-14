<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import IndexPage from '@/pages/IndexPage/IndexPage.svelte';
  import routes from '@/navigation/routes.js';
  import { TonConnectProvider } from '@/tonconnect';

  const manifestUrl = new URL(
    'tonconnect-manifest.json',
    window.location.href
  ).toString();

  export let url = '';
</script>

<TonConnectProvider {manifestUrl}>
  <Router {url}>
    {#each routes as { id, path, Component }}
      {#if id === 'home'}
        <Route><IndexPage /></Route>
      {:else if Component}
        <Route {path} component={Component} />
      {/if}
    {/each}
  </Router>
</TonConnectProvider>
