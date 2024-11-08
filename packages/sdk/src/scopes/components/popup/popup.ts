import { TypedError } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { ERR_ALREADY_OPENED } from '@/errors.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';

const OPEN_METHOD = 'web_app_open_popup';
const wrapSupported = createWrapSupported('popup', OPEN_METHOD);

/**
 * Signal indicating if a popup is opened.
 */
export const isOpened = signal(false);

/**
 * Signal indicating if popups are supported.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

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
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid title
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid message
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid buttons count
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button id length
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button text length
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
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
export const open = wrapSupported(
  'open',
  async (options: OpenOptions): Promise<string | null> => {
    if (isOpened()) {
      throw new TypedError(ERR_ALREADY_OPENED, 'A popup is already opened');
    }
    isOpened.set(true);

    try {
      const { button_id: buttonId = null } = await request(OPEN_METHOD, 'popup_closed', {
        ...options,
        params: prepareParams(options),
      });
      return buttonId;
    } finally {
      isOpened.set(false);
    }
  },
);