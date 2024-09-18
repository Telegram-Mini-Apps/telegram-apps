import { TypedError, CancelablePromise, type PopupParams } from '@telegram-apps/bridge';

import { withIsSupported } from '@/scopes/withIsSupported.js';
import { request } from '@/scopes/globals/globals.js';
import { ERR_POPUP_INVALID_PARAMS, ERR_ALREADY_OPENED } from '@/errors.js';

import { isOpened } from './signals.js';
import type { OpenOptions } from './types.js';

const MINI_APPS_METHOD = 'web_app_open_popup';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid title length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid message length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid buttons length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button id length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid text length.
 */
function preparePopupParams(params: OpenOptions): PopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  // Check title.
  if (title.length > 64) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid title length: ${title.length}`);
  }

  // Check message.
  if (!message || message.length > 256) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid message length: ${message.length}`);
  }

  // Check buttons.
  if (buttons.length > 3) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid buttons count: ${buttons.length}`);
  }

  return {
    title,
    message,
    buttons: buttons.length
      ? buttons.map((b) => {
        const id = b.id || '';
        if (id.length > 64) {
          throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid button id length: ${id.length}`);
        }

        if (!b.type || b.type === 'default' || b.type === 'destructive') {
          const text = b.text.trim();
          if (!text || text.length > 64) {
            throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid button text length: ${text.length}`);
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
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid title length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid message length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid buttons length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button id length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid text length.
 */
export const open = withIsSupported(
  (options: OpenOptions): CancelablePromise<string | null> => {
    return CancelablePromise.withFn(() => {
      if (isOpened()) {
        throw new TypedError(ERR_ALREADY_OPENED);
      }

      isOpened.set(true);

      return request(MINI_APPS_METHOD, 'popup_closed', {
        ...options,
        params: preparePopupParams(options),
      })
        .then(({ button_id = null }) => button_id)
        .finally(() => {
          isOpened.set(false);
        });
    });
  }, MINI_APPS_METHOD,
);
