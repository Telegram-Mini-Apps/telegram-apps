import type { Version } from '@telegram-apps/types';

import { createError } from '../errors/createError.js';
import { ERR_METHOD_PARAMETER_UNSUPPORTED, ERR_METHOD_UNSUPPORTED } from '../errors/errors.js';
import { isRecord } from '../isRecord.js';
import { supports } from './supports.js';
import { type PostEvent, postEvent } from './postEvent.js';

/**
 * Creates a function which checks if specified method and parameters are supported.
 *
 * If method or parameters are unsupported, an error will be thrown.
 * @param version - Telegram Mini Apps version.
 * @throws {BridgeError} ERR_METHOD_UNSUPPORTED
 * @throws {BridgeError} ERR_METHOD_PARAMETER_UNSUPPORTED
 * @see ERR_METHOD_UNSUPPORTED
 * @see ERR_METHOD_PARAMETER_UNSUPPORTED
 */
export function createPostEvent(version: Version): PostEvent {
  return (method: any, params: any) => {
    // Firstly, check if a method is supported.
    if (!supports(method, version)) {
      throw createError(ERR_METHOD_UNSUPPORTED, `Method "${method}" is unsupported in Mini Apps version ${version}`);
    }

    // Method could use parameters, which are supported only in specific
    // versions of Mini Apps.
    // We are validating only those parameters, which are not backward compatible.
    if (
      isRecord(params)
      && method === 'web_app_set_header_color'
      && 'color' in params
      && !supports(method, 'color', version)
    ) {
      throw createError(
        ERR_METHOD_PARAMETER_UNSUPPORTED,
        `Parameter "color" of "${method}" method is unsupported in Mini Apps version ${version}`,
      );
    }

    return postEvent(method, params);
  };
}
