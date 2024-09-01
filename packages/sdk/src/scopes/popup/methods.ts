import { request, type PopupParams } from '@telegram-apps/bridge';
import { BetterPromise } from '@telegram-apps/toolkit';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import { ERR_POPUP_INVALID_PARAMS, ERR_POPUP_OPENED } from '@/errors/errors.js';
import { SDKError } from '@/errors/SDKError.js';

import { isOpened } from './signals.js';
import type { OpenOptions } from './types.js';

const MINI_APPS_METHOD = 'web_app_open_popup';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 * @throws {SDKError} ERR_POPUP_INVALID_PARAMS
 */
function preparePopupParams(params: OpenOptions): PopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  // Check title.
  if (title.length > 64) {
    throw new SDKError(ERR_POPUP_INVALID_PARAMS, `Invalid title length: ${title.length}`);
  }

  // Check message.
  if (!message || message.length > 256) {
    throw new SDKError(ERR_POPUP_INVALID_PARAMS, `Invalid message length: ${message.length}`);
  }

  // Check buttons.
  if (buttons.length > 3) {
    throw new SDKError(ERR_POPUP_INVALID_PARAMS, `Invalid buttons count: ${buttons.length}`);
  }

  return {
    title,
    message,
    buttons: buttons.length
      ? buttons.map((b) => {
        const id = b.id || '';
        if (id.length > 64) {
          throw new SDKError(ERR_POPUP_INVALID_PARAMS, `Invalid button id length: ${id.length}`);
        }

        if (!b.type || b.type === 'default' || b.type === 'destructive') {
          const text = b.text.trim();
          if (!text || text.length > 64) {
            throw new SDKError(ERR_POPUP_INVALID_PARAMS, `Invalid button text length: ${text.length}`);
          }
          return { ...b, text, id };
        }
        return { ...b, id };
      })
      : [{ type: 'close', id: '' }],
  };
}

/**
 * A method that shows a native popup described by the `params` argument.
 * The promise will be resolved when the popup is closed. Resolved value will have
 * an identifier of pressed button.
 *
 * If a user clicked outside the popup or clicked the top right popup close button, null will be
 * returned.
 *
 * @param options - popup parameters.
 * @throws {SDKError} ERR_POPUP_OPENED
 * @throws {SDKError} ERR_POPUP_INVALID_PARAMS
 */
export const open: WithIsSupported<(options: OpenOptions) => BetterPromise<string | null>> =
  decorateWithIsSupported(options => {
    return BetterPromise.withFn(() => {
      if (isOpened()) {
        throw new SDKError(ERR_POPUP_OPENED);
      }

      isOpened.set(true);

      return request(MINI_APPS_METHOD, 'popup_closed', {
        ...options || {},
        postEvent: $postEvent(),
        params: preparePopupParams(options),
      })
        .then(({ button_id = null }) => button_id)
        .finally(() => {
          isOpened.set(false);
        });
    });
  }, MINI_APPS_METHOD);
