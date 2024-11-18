import { onCleanup, onMount, type Component } from 'solid-js';

import { useTonConnectUI } from '@/tonconnect/TonConnectUIContext.js';

export const TonConnectButton: Component = () => {
  const [, opts] = useTonConnectUI();
  const buttonRootId = 'ton-connect-button';

  onMount(() => {
    opts.setUIOptions({ buttonRootId });
  });

  onCleanup(() => {
    opts.setUIOptions({ buttonRootId: null });
  });

  return <div id={buttonRootId} style={{ width: 'fit-content' }}/>;
};
