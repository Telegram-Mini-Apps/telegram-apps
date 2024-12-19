import { postEvent } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';

const METHOD = 'web_app_add_to_home_screen';

/**
 * Prompts the user to add the Mini App to the home screen. Note that if the device cannot
 * determine the installation status, a corresponding event may not be received even if the icon
 * has been added.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example Using `isAvailable`
 * if (addToHomeScreen.isAvailable()) {
 *   addToHomeScreen();
 * }
 * @example Using `ifAvailable`
 * addToHomeScreen.ifAvailable()
 */
export const addToHomeScreen = wrapSafe(
  'addToHomeScreen',
  () => {
    postEvent(METHOD);
  }, { isSupported: METHOD },
);