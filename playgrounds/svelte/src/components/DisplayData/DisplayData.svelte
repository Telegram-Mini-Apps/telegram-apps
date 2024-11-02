<script module lang="ts">
  export interface IRow {
    title: string;
    value?: RGB | string | number | boolean | Snippet;
  }

  interface IProps {
    rows: IRow[];
  }
</script>

<script lang="ts">
  import './DisplayData.css';

  import { type Snippet } from 'svelte';
  import RGBRender from '@/components/RGB/RGB.svelte';
  import { isRGB, type RGB } from '@telegram-apps/sdk-svelte';

  const { rows }: IProps = $props();

  function mapValueToString(value?: boolean | string) {
    switch (value) {
      case true:
        return '✔️';
      case false:
        return '❌';
      case undefined:
        return 'empty';
      default:
        return value;
    }
  }
</script>

<div>
  {#each rows as { title, value, meta }, idx}
    <div class="display-data__line">
      <span class="display-data__line-title">{title}</span>
      <span class="display-data__line-value">
        {#if meta}
          {@const Component = value}
          <Component {...meta} />
        {:else if typeof value === 'string' && isRGB(value) && typeof value === 'string' && isRGB(value)}
          <RGBRender color={value} />
        {:else}
          <span>{mapValueToString(value)}</span>
        {/if}
      </span>
    </div>
  {/each}
</div>
