import {
  TypedError,
  type WriteAccessRequestedStatus,
  type AsyncOptions,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { ERR_ALREADY_REQUESTING } from '@/errors.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';

const REQUEST_WRITE_ACCESS_METHOD = 'web_app_request_write_access';

/**
 * Signal indicating if write access is currently being requested.
 */
export const isRequestingWriteAccess = signal(false);

/**
 * Requests write message access to the current user.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (requestWriteAccess.isAvailable()) {
 *   const status = await requestWriteAccess();
 * }
 */
export const requestWriteAccess = wrapSafe(
  'requestWriteAccess',
  (options?: AsyncOptions): Promise<WriteAccessRequestedStatus> => {
    if (isRequestingWriteAccess()) {
      throw new TypedError(ERR_ALREADY_REQUESTING, 'Write access request is currently in progress');
    }
    isRequestingWriteAccess.set(true);

    return request(REQUEST_WRITE_ACCESS_METHOD, 'write_access_requested', options)
      .then(r => r.status)
      .finally(() => {
        isRequestingWriteAccess.set(false);
      });
  },
  {
    isSupported: REQUEST_WRITE_ACCESS_METHOD,
  },
);
