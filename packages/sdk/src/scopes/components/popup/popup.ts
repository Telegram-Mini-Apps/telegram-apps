import { request } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';

const OPEN_METHOD = 'web_app_open_popup';
const wrapSupported = createWrapSupported('popup', OPEN_METHOD);

/**
 * Signal indicating if popups are supported.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

const [
  fn,
  [, openPromise, isOpened],
  [, openError],
] = defineNonConcurrentFn(async (options: OpenOptions) => {
  const { button_id: buttonId } = await request(OPEN_METHOD, 'popup_closed', {
    ...options,
    params: prepareParams(options),
  });
  return buttonId === undefined ? null : buttonId;
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
export const open = wrapSupported('open', fn);
export { openError, openPromise, isOpened };
