import { useContext } from 'solid-js';

import { SDKContext } from './SDKContext.js';
import type { SDKContextType } from './types.js';

/**
 * Uses SDKContext context.
 */
export function useSDKContext(): SDKContextType {
  return useContext(SDKContext);
}
