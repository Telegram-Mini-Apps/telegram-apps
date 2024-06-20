import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';
import type { Wallet, WalletInfoWithOpenMethod } from '@tonconnect/ui';

import { useTonConnectUI } from './useTonConnectUI.js';

/**
 * Use it to get user's current ton wallet. If wallet is not connected hook will return null.
 * @see Original React code:
 * https://github.com/ton-connect/sdk/blob/main/packages/ui-react/src/hooks/useTonWallet.ts
 */
export function useTonWallet(): Accessor<Wallet | (Wallet & WalletInfoWithOpenMethod) | null> {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = createSignal<Wallet |(Wallet & WalletInfoWithOpenMethod) | null>(
    tonConnectUI().wallet || null,
  );

  createEffect(() => onCleanup(
    tonConnectUI().onStatusChange((value) => {
      setWallet(value);
    }),
  ));

  return wallet;
}
