import { createContext, useContext } from 'react';

import type { SDKContextType } from './SDKProvider.types.js';

export const SDKContext = createContext<SDKContextType | undefined>(undefined);

/**
 * @throws Error useSDK was used outside SDKProvider.
 * @returns SDK context.
 */
export function useSDK(): SDKContextType {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK was used outside the SDKProvider.');
  }
  return context;
}
