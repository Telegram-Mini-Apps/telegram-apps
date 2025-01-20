import { request } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';

import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

const OPEN_METHOD = 'web_app_open_popup';
const wrapSupported = createWrapSupported('popup', OPEN_METHOD);

/**
 * Signal indicating if popups are supported.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

const [
  noConcurrent,
  openPromise,
  isOpened,
  openError,
] = defineNonConcurrentFn((options: OpenOptions) => {
  return request(OPEN_METHOD, 'popup_closed', {
    ...options,
    params: prepareParams(options),
  }).then(({ button_id }) => button_id === undefined ? null : button_id);
}, 'A popup is already opened');

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
 * @throws {OpenFailedError} Invalid title
 * @throws {OpenFailedError} Invalid message
 * @throws {OpenFailedError} Invalid buttons count
 * @throws {OpenFailedError} Invalid button id length
 * @throws {OpenFailedError} Invalid button text length
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
export const open = wrapSupported('open', noConcurrent);
export { openError, openPromise, isOpened };
