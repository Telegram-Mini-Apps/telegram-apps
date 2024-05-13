import { useContext } from 'solid-js';

import { TonConnectUIContext } from '@/tonconnect/TonConnectUIContext.js';

/**
 * @returns {TonConnectUIContextType}
 */
export function useTonConnectUI() {
  const context = useContext(TonConnectUIContext);
  if (!context) {
    throw new Error('Unable to get TonConnectUIContext');
  }
  return context;
}
