<script lang="ts">
  import './IndexPage.css';
  import { Router, Route } from 'svelte-routing';
  import Link from '@/components/Link/Link.svelte';
  import Page from '@/components/Page/Page.svelte';
  import routes from '@/navigation/routes.js';
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
