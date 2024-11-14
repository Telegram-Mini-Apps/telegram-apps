<script lang="ts">
  import { createContextValue } from './TonConnectContext';

  export let manifestUrl;

  createContextValue(manifestUrl);
</script>

<slot />
