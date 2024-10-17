import { type Computed, computed } from '@telegram-apps/signals';

import { type MethodName, supports } from '@telegram-apps/bridge';
import { $version } from '@/scopes/globals.js';

/**
 * @returns A signal returning true if the specified Mini Apps method is supported.
 * @param method - Mini Apps method name
 */
export function createIsSupported(method: MethodName): Computed<boolean> {
  return computed(() => {
    return supports(method, $version());
  });
}