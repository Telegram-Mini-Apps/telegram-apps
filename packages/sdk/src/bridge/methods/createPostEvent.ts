import { createError } from '@/errors/createError.js';
import { ERR_METHOD_PARAMETER_UNSUPPORTED, ERR_METHOD_UNSUPPORTED } from '@/errors/errors.js';
import { isRecord } from '@/misc/isRecord.js';
import { supports } from '@/supports/supports.js';
import type { Version } from '@/version/types.js';

import { type PostEvent, postEvent } from './postEvent.js';

/**
 * Creates function which checks if specified method and parameters are supported. In case,
 * method or parameters are unsupported, an error will be thrown.
 * @param version - Telegram Mini Apps version.
 * @throws {SDKError} ERR_METHOD_UNSUPPORTED
 * @throws {SDKError} ERR_METHOD_PARAMETER_UNSUPPORTED
 * @see ERR_METHOD_UNSUPPORTED
 * @see ERR_METHOD_PARAMETER_UNSUPPORTED
 */
export function createPostEvent(version: Version): PostEvent {
  return (method: any, params: any) => {
    // Firstly, check if method itself is supported.
    if (!supports(method, version)) {
      throw createError(ERR_METHOD_UNSUPPORTED, `Method "${method}" is unsupported in Mini Apps version ${version}`);
    }

    // Method could use parameters, which are supported only in specific versions of Telegram
    // Mini Apps.
    if (isRecord(params)) {
      let validateParam: string | undefined;

      if (method === 'web_app_open_link' && 'try_instant_view' in params) {
        validateParam = 'try_instant_view';
      } else if (method === 'web_app_set_header_color' && 'color' in params) {
        validateParam = 'color';
      }

      if (validateParam && !supports(method, validateParam, version)) {
        throw createError(
          ERR_METHOD_PARAMETER_UNSUPPORTED,
          `Parameter "${validateParam}" of "${method}" method is unsupported in Mini Apps version ${version}`,
        );
      }
    }

    return postEvent(method, params);
  };
}
