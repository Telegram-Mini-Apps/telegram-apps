import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { postEvent } from '@/globals.js';

const METHOD_NAME = 'web_app_add_to_home_screen';

/**
 * Prompts the user to add the Mini App to the home screen.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
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
    postEvent(METHOD_NAME);
  },
  { isSupported: METHOD_NAME },
);