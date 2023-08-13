import { useContext } from 'solid-js';

import { SDKContext } from './context.js';
import type { SDKContextType } from './types.js';

/**
 * Uses SDKContext context.
 */
export function useSDKContext(): SDKContextType {
  const context = useContext(SDKContext);

  if (context === undefined) {
    throw new Error('useSDKContext hook was used outside of SDKProvider.');
  }
  return context;
}
