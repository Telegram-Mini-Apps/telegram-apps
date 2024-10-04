import { TypedError, supports } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { $version, request } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';

import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';

const MINI_APPS_METHOD = 'web_app_open_popup';

/**
 * @returns True if the back button is supported.
 */
export function isSupported(): boolean {
  return supports(MINI_APPS_METHOD, $version());
}

/**
 * True if a popup is currently opened.
 */
export const isOpened = signal(false);

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
 */
export async function open(options: OpenOptions): Promise<string | null> {
  if (isOpened()) {
    throw new TypedError(ERR_ALREADY_CALLED);
  }
  isOpened.set(true);

  try {
    const { button_id: buttonId = null } = await request(MINI_APPS_METHOD, 'popup_closed', {
      ...options,
      params: prepareParams(options),
    });
    return buttonId;
  } finally {
    isOpened.set(false);
  }
}
