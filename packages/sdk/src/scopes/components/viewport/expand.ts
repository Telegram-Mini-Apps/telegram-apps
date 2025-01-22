import { postEvent } from '@/globals.js';

import { wrapBasic } from './wrappers.js';

/**
 * A method that expands the Mini App to the maximum available height. To find
 * out if the Mini App is expanded to the maximum height, refer to the value of
 * the `isExpanded`.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @see isExpanded
 * @example
 * if (expand.isAvailable()) {
 *   expand();
 * }
 */
export const expand = wrapBasic('expand', (): void => {
  postEvent('web_app_expand');
});
