import { TypedError, CancelablePromise } from '@telegram-apps/bridge';

import { withIsSupported } from '@/scopes/withIsSupported.js';
import { request } from '@/scopes/globals/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';

import { isOpened } from './signals.js';
import { prepareParams } from './prepareParams.js';
import type { OpenOptions } from './types.js';

const MINI_APPS_METHOD = 'web_app_open_popup';

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
export const open = withIsSupported(
  (options: OpenOptions): CancelablePromise<string | null> => {
    return CancelablePromise.withFn(() => {
      if (isOpened()) {
        throw new TypedError(ERR_ALREADY_CALLED);
      }

      isOpened.set(true);

      return request(MINI_APPS_METHOD, 'popup_closed', {
        ...options,
        params: prepareParams(options),
      })
        .then(({ button_id = null }) => button_id)
        .finally(() => {
          isOpened.set(false);
        });
    });
  }, MINI_APPS_METHOD,
);
