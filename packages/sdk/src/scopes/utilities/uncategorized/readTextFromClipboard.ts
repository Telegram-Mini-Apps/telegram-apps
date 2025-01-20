import { captureSameReq } from '@telegram-apps/bridge';
import type { CancelablePromise, PromiseOptions } from 'better-promises';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { createRequestId, request } from '@/globals.js';

const METHOD_NAME = 'web_app_read_text_from_clipboard';

/**
 * Reads a text from the clipboard and returns a `string` or `null`. `null` is returned
 * in cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 * @since Mini Apps v6.4
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (readTextFromClipboard.isAvailable()) {
 *   const value = await readTextFromClipboard();
 * }
 */
export const readTextFromClipboard = wrapSafe(
  'readTextFromClipboard',
  (options?: PromiseOptions): CancelablePromise<string | null> => {
    const reqId = createRequestId();

    return request(METHOD_NAME, 'clipboard_text_received', {
      ...options,
      params: { req_id: reqId },
      capture: captureSameReq(reqId),
    }).then(({ data = null }) => data);
  },
  { isSupported: METHOD_NAME },
);