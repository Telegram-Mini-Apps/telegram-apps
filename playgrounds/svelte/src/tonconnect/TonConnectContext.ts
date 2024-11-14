import { writable, type Writable } from 'svelte/store';
import { setContext, getContext } from 'svelte';
import { TonConnectUI, type TonConnectUiOptions } from '@tonconnect/ui';

export const TonConnectInjectionKey = Symbol('tonconnect');
export interface IContextValue {
  tonConnectUI: TonConnectUI;
  setTonConnectUIOptions(options: TonConnectUiOptions): void;
}

export function createContextValue(manifestUrl: string) {
  const tonConnectUI = new TonConnectUI({ manifestUrl });
  const store = writable<IContextValue>({
    tonConnectUI,
    setTonConnectUIOptions: (options: TonConnectUiOptions) => {
      tonConnectUI.uiOptions = options;
    },
  });

  setContext(TonConnectInjectionKey, store);

  return store;
}

export function getContextValue(): Writable<IContextValue> {
  return getContext(TonConnectInjectionKey);
}
