import type { AbortablePromise } from 'better-promises';

import { request } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

import { prepareParams } from './prepareParams.js';
import type { ShowOptions } from './types.js';

const OPEN_METHOD = 'web_app_open_popup';
const wrapSupported = createWrapSupported('popup', OPEN_METHOD);

/**
 * Signal indicating if popups are supported.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

const [fn, tPromise, tShowError] = defineNonConcurrentFn(
  (options: ShowOptions): AbortablePromise<string | null> => {
    return request(OPEN_METHOD, 'popup_closed', {
      ...options,
      params: prepareParams(options),
    }).then(({ button_id: buttonId }) => buttonId === undefined ? null : buttonId);
  },
  'A popup is already opened',
);

/**
 * @deprecated Deprecated for consistence naming, to be removed in the next major update. Use
 *   `show` instead.
 */
export const open = wrapSupported('open', fn);
/**
 * @deprecated Deprecated for consistence naming, to be removed in the next major update. Use
 *   `showPromise` instead.
 */
const openPromise = tPromise[1];
/**
 * @deprecated Deprecated for consistence naming, to be removed in the next major update. Use
 *   `isShown` instead.
 */
const isOpened = tPromise[2];
/**
 * @deprecated Deprecated for consistence naming, to be removed in the next major update. Use
 *   `showError` instead.
 */
const openError = tShowError[1];

export { openPromise, isOpened, openError };

/**
 * A method that shows a native popup described by the `params` argument.
 * The promise will be resolved when the popup is closed. Resolved value will have
 * an identifier of the pressed button.
 *
 * If a user clicked outside the popup or clicked the top right popup close
 * button, null will be resolved.
 *
 * @param options - popup parameters.
 * @since Mini Apps v6.2
 * @throws {InvalidArgumentsError} Invalid title
 * @throws {InvalidArgumentsError} Invalid message
 * @throws {InvalidArgumentsError} Invalid buttons count
 * @throws {InvalidArgumentsError} Invalid button id length
 * @throws {InvalidArgumentsError} Invalid button text length
 * @throws {ConcurrentCallError} A popup is already opened
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (open.isAvailable()) {
 *   const buttonId = await open({
 *     title: 'Confirm action',
 *     message: 'Do you really want to buy this burger?',
 *     buttons: [
 *       { id: 'yes', text: 'Yes' },
 *       { id: 'no', type: 'destructive', text: 'No' },
 *     ],
 *   });
 * }
 */
export const show = wrapSupported('show', fn);
export const [, showPromise, isShown] = tPromise;
export const [, showError] = tShowError;
