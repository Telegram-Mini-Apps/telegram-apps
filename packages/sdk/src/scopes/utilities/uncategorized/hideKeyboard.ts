import { postEvent } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

const HIDE_KEYBOARD_METHOD = 'web_app_hide_keyboard';

/**
 * Hides the on-screen keyboard, if it is currently visible. Does nothing if the keyboard is 
 * not active.
 * @since Mini Apps v9.1
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @example Using `.isAvailable()`
 * if (hideKeyboard.isAvailable()) {
 *   hideKeyboard();
 * }
 * @example Using `.ifAvailable()`
 * hideKeyboard.ifAvailable()
 */
export const hideKeyboard = wrapSafe(
  'hideKeyboard',
  () => postEvent(HIDE_KEYBOARD_METHOD),
  { isSupported: HIDE_KEYBOARD_METHOD },
);
