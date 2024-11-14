<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { useTonConnectUI } from './useTonConnectUI';
  import { derived } from 'svelte/store';

  let { id = 'tonconnect-button' } = $props();

  const contextValue = useTonConnectUI();

  const setTonConnectUIOptions = derived(
    contextValue,
    ($contextValue) => $contextValue.setTonConnectUIOptions
  );

  onMount(() => {
    $setTonConnectUIOptions({ buttonRootId: id });
  });

  onDestroy(() => {
    $setTonConnectUIOptions({ buttonRootId: null });
  });
</script>

<div {id} style="width: 'fit-content'"></div>
