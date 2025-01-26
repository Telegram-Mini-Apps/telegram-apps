import { type Computed } from '@telegram-apps/signals';
import { type MethodName, supports } from '@telegram-apps/bridge';

import { version } from '@/globals.js';
import { createComputed } from '@/signals-registry.js';

/**
 * @returns A signal indicating if the specified Mini Apps method is supported.
 * @param method - Mini Apps method name
 */
export function createIsSupported(method: MethodName): Computed<boolean> {
  return createComputed(() => supports(method, version()));
}