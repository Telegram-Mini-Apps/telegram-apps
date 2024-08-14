import { request, type PopupParams } from '@telegram-apps/bridge';
import { computed } from '@telegram-apps/signals';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { createError } from '@/errors/createError.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import { ERR_POPUP_INVALID_PARAMS, ERR_POPUP_OPENED } from '@/errors/errors.js';

import * as _ from './private.js';
import type { OpenOptions } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/popup
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/popup
 */

const MINI_APPS_METHOD = 'web_app_open_popup';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 * @throws {SDKError} ERR_POPUP_INVALID_PARAMS
 * @see ERR_POPUP_INVALID_PARAMS
 */
function preparePopupParams(params: OpenOptions): PopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  // Check title.
  if (title.length > 64) {
    throw createError(ERR_POPUP_INVALID_PARAMS, `Invalid title length: ${title.length}`);
  }

  // Check message.
  if (!message || message.length > 256) {
    throw createError(ERR_POPUP_INVALID_PARAMS, `Invalid message length: ${message.length}`);
  }

  // Check buttons.
  if (buttons.length > 3) {
    throw createError(ERR_POPUP_INVALID_PARAMS, `Invalid buttons count: ${buttons.length}`);
  }

  return {
    title,
    message,
    buttons: buttons.length
      ? buttons.map((b) => {
        const id = b.id || '';
        if (id.length > 64) {
          throw createError(ERR_POPUP_INVALID_PARAMS, `Invalid button id length: ${id.length}`);
        }

        if (!b.type || b.type === 'default' || b.type === 'destructive') {
          const text = b.text.trim();
          if (!text || text.length > 64) {
            throw createError(ERR_POPUP_INVALID_PARAMS, `Invalid button text length: ${text.length}`);
          }
          return { ...b, text, id };
        }
        return { ...b, id };
      })
      : [{ type: 'close', id: '' }],
  };
}

/**
 * True if a popup is currently opened.
 */
export const isOpened = computed(_.isOpened);

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
 * @see ERR_POPUP_OPENED
 */
export const open: WithIsSupported<(options: OpenOptions) => Promise<string | null>> =
  decorateWithIsSupported(async options => {
    if (_.isOpened()) {
      throw createError(ERR_POPUP_OPENED);
    }

    _.isOpened.set(true);

    try {
      const { button_id: buttonId = null } = await request({
        event: 'popup_closed',
        method: MINI_APPS_METHOD,
        postEvent: $postEvent(),
        params: preparePopupParams(options),
      });
      return buttonId;
    } finally {
      _.isOpened.set(false);
    }
  }, MINI_APPS_METHOD);
