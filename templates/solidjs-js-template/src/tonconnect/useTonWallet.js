import { createEffect, createSignal, onCleanup } from 'solid-js';

import { useTonConnectUI } from './useTonConnectUI.js';

/**
 * Use it to get user's current ton wallet. If wallet is not connected hook will return null.
 * @see Original React code:
 * https://github.com/ton-connect/sdk/blob/main/packages/ui-react/src/hooks/useTonWallet.ts
 */
export function useTonWallet() {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = createSignal(
    tonConnectUI().wallet || null,
  );

  createEffect(() => onCleanup(
    tonConnectUI().onStatusChange((value) => {
      setWallet(value);
    }),
  ));

  return wallet;
}
