import { isRecord, type Version } from '@tma.js/utils';

import { supports } from '../supports.js';
import { MethodUnsupportedError, ParameterUnsupportedError } from '../errors/index.js';
import { postEvent, type PostEvent } from './index.js';

/**
 * Creates function which checks if specified method and parameters are supported. In case,
 * method or parameters are unsupported, an error will be thrown.
 * @param version - Telegram Mini Apps version.
 * @throws {MethodUnsupportedError} Method is unsupported.
 * @throws {ParameterUnsupportedError} Method parameter is unsupported.
 */
export function createPostEvent(version: Version): PostEvent {
  return (method: any, params: any) => {
    // Firstly, check if method itself is supported.
    if (!supports(method, version)) {
      throw new MethodUnsupportedError(method, version);
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
        throw new ParameterUnsupportedError(method, validateParam, version);
      }
    }

    return postEvent(method, params);
  };
}
