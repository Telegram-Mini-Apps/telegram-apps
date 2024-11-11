<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import IndexPage from '@/pages/IndexPage/IndexPage.svelte';
  import routes from '@/navigation/routes.js';

  export let url = '';
</script>

<Router {url}>
  {#each routes as { id, path, Component }}
    {#if id === 'home'}
      <Route><IndexPage /></Route>
    {:else if Component}
      <Route {path} component={Component} />
    {/if}
  {/each}
</Router>
