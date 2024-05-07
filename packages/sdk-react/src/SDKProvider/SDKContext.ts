import { createContext, useContext } from 'react';

import type { SDKContextType } from './SDKProvider.types.js';

export const SDKContext = createContext<SDKContextType | undefined>(undefined);

export function useSDK(): SDKContextType {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK was used outside of SDKProvider.');
  }
  return context;
}
