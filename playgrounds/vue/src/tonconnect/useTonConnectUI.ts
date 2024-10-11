import { inject } from 'vue';
import type { TonConnectUiOptions } from '@tonconnect/ui';
import { TonConnectInjectionKey } from './plugin';

export function useTonConnectUI() {
  const tonConnectUI = inject(TonConnectInjectionKey);

  if (!tonConnectUI) {
    throw new Error('TonConnectUI injection is not provided. Do not forget to install plugin.');
  }

  return {
    tonConnectUI,
    setTonConnectUIOptions: (options: TonConnectUiOptions) => {
      tonConnectUI.uiOptions = options;
    },
  };
}
