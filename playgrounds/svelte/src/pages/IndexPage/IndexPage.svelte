<script lang="ts">
  import './IndexPage.css';
  import { Router } from 'svelte-routing';
  import Page from '@/components/Page/Page.svelte';
  import Nav from '@/components/Nav/Nav.svelte';
</script>

<Router>
  <Page title="Home Page">
    <p>
      This page is a home page in this boilerplate. You can use the links below
      to visit other pages with their own functionality.
    </p>
    <Nav />
  </Page>
</Router>
