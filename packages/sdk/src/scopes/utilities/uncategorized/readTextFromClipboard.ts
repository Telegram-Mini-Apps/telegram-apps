import { type AsyncOptions, type CancelablePromise, captureSameReq } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { createRequestId, request } from '@/scopes/globals.js';

const READ_CLIPBOARD_METHOD = 'web_app_read_text_from_clipboard';

/**
 * Reads a text from the clipboard and returns a `string` or `null`. `null` is returned
 * in cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 * @since Mini Apps v6.4
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (readTextFromClipboard.isAvailable()) {
 *   const value = await readTextFromClipboard();
 * }
 */
export const readTextFromClipboard = wrapSafe(
  'readTextFromClipboard',
  (options?: AsyncOptions): CancelablePromise<string | null> => {
    const reqId = createRequestId();

    return request(READ_CLIPBOARD_METHOD, 'clipboard_text_received', {
      ...options,
      params: { req_id: reqId },
      capture: captureSameReq(reqId),
    }).then(({ data = null }) => data);
  },
  {
    isSupported: READ_CLIPBOARD_METHOD,
  },
);