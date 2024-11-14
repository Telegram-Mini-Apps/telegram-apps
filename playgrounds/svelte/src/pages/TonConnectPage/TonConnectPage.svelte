<script lang="ts">
  import Page from '@/components/Page/Page.svelte';
  import { useTonWallet, TonConnectButton } from '@/tonconnect';
  import DisplayData, {
    type IRow,
  } from '@/components/DisplayData/DisplayData.svelte';
  import Link from '@/components/Link/Link.svelte';
  import { derived, type Writable } from 'svelte/store';
  import type { ConnectedWallet } from '@tonconnect/ui';

  import './TonConnectPage.css';

  const wallet: Writable<ConnectedWallet> = useTonWallet();

  const walletExtended = derived(wallet, ($wallet) => {
    return $wallet && 'imageUrl' in $wallet ? $wallet : null;
  });

  const rows = derived(wallet, ($wallet) => {
    return $wallet
      ? [
          { title: 'Address', value: $wallet.account.address },
          { title: 'Chain', value: $wallet.account.chain },
          { title: 'Public Key', value: $wallet.account.publicKey },
        ]
      : [];
  });
</script>

<Page title="TON Connect">
  {#if !$wallet}
    <p>
      To display the data related to the TON Connect, it is required to connect
      your wallet.
    </p>
  {:else if $walletExtended}
    <div class="ton-connect-page__provider">
      <img
        class="ton-connect-page__provider-image"
        src={$walletExtended.imageUrl}
        alt="Provider logo"
        width="60"
        height="60"
      />
      <div class="ton-connect-page__provider-meta">
        <p class="ton-connect-page__provider-wallet-name">
          {$walletExtended.name}&nbsp;
          <span class="ton-connect-page__provider-app-name">
            {$walletExtended.appName}
          </span>
        </p>
        <Link
          path={$walletExtended.aboutUrl}
          title={'About connected wallet'}
        />
        <DisplayData rows={$rows} />
      </div>
    </div>
  {/if}
  <div class="ton-connect-page__button-container">
    <TonConnectButton />
  </div>
</Page>
