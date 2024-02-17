import { inject } from 'vue';

import { SDKInjection } from './SDKInjection.js';
import type { SDKContextType } from './types.js';

/**
 * Returns current SDK information.
 */
export function useSDK(): SDKContextType {
  const context = inject(SDKInjection);

  if (!context) {
    throw new Error('Unable to get sdk as long as SDK is not provided');
  }

  return context;
}
