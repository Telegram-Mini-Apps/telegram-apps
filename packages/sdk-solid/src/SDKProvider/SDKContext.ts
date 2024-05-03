import { createContext, useContext } from 'solid-js';

import type { SDKContextType } from './SDKProvider.types.js';

export const SDKContext = createContext<SDKContextType>();

export function useSDK(): SDKContextType {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK was used outside of SDKProvider.');
  }
  return context;
}
