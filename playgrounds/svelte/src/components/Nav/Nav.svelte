<script lang="ts">
  import routes from '@/navigation/routes.js';
  import Link from '@/components/Link/Link.svelte';
</script>

<ul class="index-page__links">
  {#each routes as { title, path, Component }}
    {#if Component}
      <li class="index-page__link-item">
        <Link className={'index-page__link'} {title} {path} />
      </li>
    {/if}
  {/each}
</ul>
