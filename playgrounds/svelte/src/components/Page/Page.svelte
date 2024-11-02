<script lang="ts">
  import './Page.css';

  interface IProps {
    title: string,
    children?: Snippet,
    disclaimer?: Snippet
  }

  import type { Snippet } from 'svelte';

  const { title, disclaimer, children }: IProps = $props();
</script>

<main class="page">
  <h1>{title}</h1>
  {#if disclaimer}
    <div class="page__disclaimer">{@render disclaimer()}</div>
  {/if}
  {@render children?.()}
</main>