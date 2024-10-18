import { onMounted, onUnmounted, readonly, shallowRef } from 'vue';
import type { ConnectedWallet, Wallet, WalletInfoWithOpenMethod } from '@tonconnect/ui';
import { useTonConnectUI } from './useTonConnectUI';

export function useTonWallet() {
  const wallet = shallowRef<Wallet | (Wallet & WalletInfoWithOpenMethod) | null>(null);
  const { tonConnectUI } = useTonConnectUI();

  onMounted(() => {
    if (tonConnectUI) {
      wallet.value = tonConnectUI.wallet;
      const unsubscribe = tonConnectUI.onStatusChange((value: ConnectedWallet | null) => {
        wallet.value = value;
      });
      onUnmounted(() => {
        unsubscribe();
      });
    }
  });

  return { wallet: readonly(wallet) };
}
