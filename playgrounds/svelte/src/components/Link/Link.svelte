<script lang="ts">
  import type { Snippet } from 'svelte';

  interface IProps {
    title: string;
    path: string;
    className?: string;
    Icon?: Snippet;
  }

  import './Link.css';
  import { Link } from 'svelte-routing';

  const { title, path, className = '', Icon }: IProps = $props();
</script>

<Link class={`${className} index-link__item`} to={path}>
  {#if Icon}
    <i class="index-page__link-icon">
      {@render Icon()}
    </i>
  {/if}
  {title}
</Link>
