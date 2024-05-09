import { isSSR } from '@/env/isSSR.js';
import { createError } from '@/errors/createError.js';
import { ERR_SSR_INIT } from '@/errors/errors.js';
import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { BiometryManager } from './BiometryManager.js';
import { requestBiometryInfo } from './requestBiometryInfo.js';

/**
 * @returns A promise with a new initialized instance of the `BiometryManager` class.
 * @see BiometryManager
 */
export const initBiometryManager = createComponentInitFn<
  'biometryManager',
  Promise<BiometryManager>,
  'version'
>('biometryManager', async ({ postEvent, version, state }) => {
  if (state) {
    return new BiometryManager({ ...state, version, postEvent });
  }

  if (isSSR()) {
    throw createError(
      ERR_SSR_INIT,
      'BiometryManager cannot be instantiated on the server side without passing the ssr.state object.',
    );
  }

  return new BiometryManager({
    ...(await requestBiometryInfo({ timeout: 1000 })),
    version,
    postEvent,
  });
});
