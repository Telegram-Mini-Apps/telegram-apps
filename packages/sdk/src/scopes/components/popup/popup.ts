import { TypedError } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';

const WEB_APP_OPEN_POPUP = 'web_app_open_popup';

/**
 * @returns True if the Popup is supported.
 */
export const isSupported = createIsSupported(WEB_APP_OPEN_POPUP);

/**
 * True if a popup is currently opened.
 */
export const isOpened = signal(false);

const wrapSupported = createWrapSafeSupported('popup', WEB_APP_OPEN_POPUP);

/**
 * A method that shows a native popup described by the `params` argument.
 * The promise will be resolved when the popup is closed. Resolved value will have
 * an identifier of pressed button.
 *
 * If a user clicked outside the popup or clicked the top right popup close button, null will be
 * returned.
 *
 * @param options - popup parameters.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid title length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid message length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid buttons length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button id length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid text length.
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
      throw new TypedError(ERR_ALREADY_CALLED);
    }
    isOpened.set(true);

    try {
      const { button_id: buttonId = null } = await request(WEB_APP_OPEN_POPUP, 'popup_closed', {
        ...options,
        params: prepareParams(options),
      });
      return buttonId;
    } finally {
      isOpened.set(false);
    }
  },
);