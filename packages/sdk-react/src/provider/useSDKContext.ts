import { useContext } from 'react';

import { SDKContext } from './SDKContext.js';
import type { SDKContextType } from './types.js';

/**
 * Returns current SDK information.
 */
export function useSDKContext(): SDKContextType {
  return useContext(SDKContext);
}
