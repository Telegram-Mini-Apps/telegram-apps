import { createContext, useContext } from 'solid-js';

/**
 * @typedef {array} TonConnectUIContextType
 * @property {() => import('@tonconnect/ui').TonConnectUI} 0
 * @property {{ setUIOptions: (options: import('@tonconnect/ui').TonConnectUiOptions) => void }} 1
 */

export const TonConnectUIContext = createContext();

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
