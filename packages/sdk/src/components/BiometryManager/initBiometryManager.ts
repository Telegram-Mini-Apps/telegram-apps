import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';
import { supports } from '@/supports/supports.js';

import { BiometryManager } from './BiometryManager.js';
import { requestBiometryInfo } from './requestBiometryInfo.js';

/**
 * @returns A promise with a new initialized instance of the `BiometryManager` class.
 * @see BiometryManager
 */
export const initBiometryManager = createComponentInitFn(
  'biometryManager',
  async ({ postEvent, version, state }) => {
    return new BiometryManager({
      ...(state || supports('web_app_biometry_get_info', version)
        ? state || await requestBiometryInfo({ timeout: 1000 })
        : {
          available: false,
          accessGranted: false,
          accessRequested: false,
          tokenSaved: false,
          deviceId: '',
        }),
      version,
      postEvent,
    });
  },
);
