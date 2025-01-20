import { type PopupParams } from '@telegram-apps/bridge';

import { OpenFailedError } from '@/errors.js';

import type { OpenOptions } from './types.js';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 * @throws {OpenFailedError} Invalid title
 * @throws {OpenFailedError} Invalid message
 * @throws {OpenFailedError} Invalid buttons count
 * @throws {OpenFailedError} Invalid button id length
 * @throws {OpenFailedError} Invalid button text length
 */
export function prepareParams(params: OpenOptions): PopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  if (title.length > 64) {
    throw new OpenFailedError(`Invalid title: ${title}`);
  }
  if (!message || message.length > 256) {
    throw new OpenFailedError(`Invalid message: ${message}`);
  }
  if (buttons.length > 3) {
    throw new OpenFailedError(`Invalid buttons count: ${buttons.length}`);
  }

  return {
    title,
    message,
    buttons: buttons.length
      ? buttons.map((b, idx) => {
        const id = b.id || '';
        if (id.length > 64) {
          throw new OpenFailedError(`Button with index ${idx} has invalid id: ${id}`);
        }

        if (!b.type || b.type === 'default' || b.type === 'destructive') {
          const text = b.text.trim();
          if (!text || text.length > 64) {
            throw new OpenFailedError(`Button with index ${idx} has invalid text: ${text}`);
          }
          return { type: b.type, text, id };
        }
        return { type: b.type, id };
      })
      : [{ type: 'close', id: '' }],
  };
}