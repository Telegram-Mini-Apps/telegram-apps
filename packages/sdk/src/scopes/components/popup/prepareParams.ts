import { type PopupParams, TypedError } from '@telegram-apps/bridge';

import { ERR_POPUP_INVALID_PARAMS } from '@/errors.js';

import type { OpenOptions } from './types.js';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid title
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid message
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid buttons count
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid button id length.
 * @throws {TypedError} ERR_POPUP_INVALID_PARAMS: Invalid text length.
 */
export function prepareParams(params: OpenOptions): PopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  if (title.length > 64) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid title: ${title}`);
  }
  if (!message || message.length > 256) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid message: ${message}`);
  }
  if (buttons.length > 3) {
    throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Invalid buttons count: ${buttons.length}`);
  }

  return {
    title,
    message,
    buttons: buttons.length
      ? buttons.map((b, idx) => {
        const id = b.id || '';
        if (id.length > 64) {
          throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Button with index ${idx} has invalid id: ${id}`);
        }

        if (!b.type || b.type === 'default' || b.type === 'destructive') {
          const text = b.text.trim();
          if (!text || text.length > 64) {
            throw new TypedError(ERR_POPUP_INVALID_PARAMS, `Button with index ${idx} has invalid text: ${text}`);
          }
          return { type: b.type, text, id };
        }
        return { type: b.type, id };
      })
      : [{ type: 'close', id: '' }],
  };
}