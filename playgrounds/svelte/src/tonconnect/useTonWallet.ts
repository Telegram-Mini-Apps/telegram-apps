import { useTonConnectUI } from './useTonConnectUI';
import type { ConnectedWallet, Wallet } from '@tonconnect/ui';
import { writable } from 'svelte/store';

export function useTonWallet() {
  const contextValue = useTonConnectUI();
  const wallet = writable<Wallet | ConnectedWallet>();

  contextValue.subscribe((newContextValue) => {
    if (newContextValue.tonConnectUI.wallet) {
      wallet.set(newContextValue.tonConnectUI.wallet);
    }
  });

  return wallet;
}
