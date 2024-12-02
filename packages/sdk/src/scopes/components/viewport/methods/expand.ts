import { postEvent } from '@/scopes/globals.js';

import { wrapBasic } from './wrappers.js';

/**
 * A method that expands the Mini App to the maximum available height. To find
 * out if the Mini App is expanded to the maximum height, refer to the value of
 * the `isExpanded`.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @see isExpanded
 * @example
 * if (expand.isAvailable()) {
 *   expand();
 * }
 */
export const expand = wrapBasic('expand', (): void => {
  postEvent('web_app_expand');
});
