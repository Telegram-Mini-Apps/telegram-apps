import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { BiometryManager } from './BiometryManager.js';
import { requestBiometryInfo } from './requestBiometryInfo.js';

/**
 * @returns A promise with a new initialized instance of the `BiometryManager` class.
 * @see BiometryManager
 */
export const initBiometryManager = createComponentInitFn(
  'biometryManager',
  async ({ postEvent, version, state }) => new BiometryManager({
    ...(state || await requestBiometryInfo({ timeout: 1000 })),
    version,
    postEvent,
  }),
);
